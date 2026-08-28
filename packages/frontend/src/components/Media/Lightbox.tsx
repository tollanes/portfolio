"use client";

import type { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";

import styles from "./Lightbox.module.scss";

export interface MediaItem {
  image: StaticImageData;
  alt: string;
  /** Shown under the image. Falls back to the alt text. */
  caption?: string;
}

interface LightboxProps {
  items: MediaItem[];
  /** Index of the open item, or null when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onIndex: (index: number) => void;
}

/**
 * Full-screen image viewer. Built on <dialog> so the top layer, Escape and the
 * focus trap come from the platform rather than from us; only arrow-key
 * stepping and the scroll lock are ours.
 */
const Lightbox = ({ items, index, onClose, onIndex }: LightboxProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;
  const at = index ?? 0;
  const item = items[at];

  // Depends on index, not just on isOpen, so state and dialog cannot drift
  // apart while stepping between images.
  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first tabbable child, which would be Prev.
      closeRef.current?.focus();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [index, isOpen]);

  /**
   * Escape closes the dialog in the platform, without going through our state.
   * The close event does not bubble, so React's onClose does not fire for it —
   * we have to listen on the node itself or the two drift apart.
   */
  useEffect(() => {
    const dialog = ref.current;

    if (!dialog) {
      return;
    }

    dialog.addEventListener("close", onClose);

    return () => dialog.removeEventListener("close", onClose);
  }, [onClose]);

  // showModal() does not stop the page behind the dialog from scrolling.
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [isOpen]);

  const step = useCallback(
    (by: number) => onIndex((at + by + items.length) % items.length),
    [at, items.length, onIndex]
  );

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      onKeyDown={(event) => {
        // Escape is handled here as well as by the close listener above, so
        // closing does not depend on the platform's close event reaching us.
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();

          return;
        }

        if (items.length < 2) {
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        }
      }}
    >
      {isOpen && item && (
        // Clicking anywhere that is not the image or the bar closes the viewer.
        <div className={styles.inner} onClick={onClose}>
          <div className={styles.bar} onClick={(event) => event.stopPropagation()}>
            {items.length > 1 && (
              <span className={styles.count}>
                {String(at + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            )}

            {items.length > 1 && (
              <>
                <button type="button" className={styles.action} onClick={() => step(-1)}>
                  Prev
                </button>
                <button type="button" className={styles.action} onClick={() => step(1)}>
                  Next
                </button>
              </>
            )}

            <button ref={closeRef} type="button" className={`${styles.action} ${styles.close}`} onClick={onClose}>
              Close
            </button>
          </div>

          <div className={styles.stage} onClick={(event) => event.stopPropagation()}>
            <Image
              fill
              className={styles.image}
              src={item.image}
              alt={item.alt}
              sizes="100vw"
              placeholder="blur"
              loading="eager"
            />
          </div>

          <p className={styles.caption} onClick={(event) => event.stopPropagation()}>
            {item.caption ?? item.alt}
          </p>
        </div>
      )}
    </dialog>
  );
};

export default Lightbox;
