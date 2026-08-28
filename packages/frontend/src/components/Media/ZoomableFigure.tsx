"use client";

import type { StaticImageData } from "next/image";
import { useState } from "react";
import Image from "next/image";

import styles from "./ZoomableFigure.module.scss";
import Lightbox from "./Lightbox";

interface ZoomableFigureProps {
  image: StaticImageData;
  alt: string;
  caption: string;
}

/** A captioned screenshot that opens full screen. Interface detail is the point
 *  of these, and at column width most of it is unreadable. */
const ZoomableFigure = ({ image, alt, caption }: ZoomableFigureProps) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <figure>
      <button
        type="button"
        className={styles.button}
        onClick={() => setOpen(0)}
        aria-label={`View full screen: ${alt}`}
      >
        <Image
          className={styles.image}
          src={image}
          alt={alt}
          sizes="(max-width: 1160px) 100vw, 1112px"
          placeholder="blur"
        />
      </button>

      <figcaption className={styles.caption}>{caption}</figcaption>

      <Lightbox items={[{ image, alt, caption }]} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </figure>
  );
};

export default ZoomableFigure;
