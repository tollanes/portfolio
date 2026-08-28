"use client";

import { useState } from "react";
import Image from "next/image";

import styles from "./Gallery.module.scss";
import Lightbox, { type MediaItem } from "./Lightbox";

/** Masonry of renders; each tile opens the full-screen viewer. */
const Gallery = ({ items }: { items: MediaItem[] }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className={styles.gallery}>
        {items.map((item, index) => (
          <button
            key={item.image.src}
            type="button"
            className={styles.tile}
            onClick={() => setOpen(index)}
            aria-label={`View full screen: ${item.alt}`}
          >
            <Image src={item.image} alt={item.alt} sizes="(max-width: 640px) 100vw, 380px" placeholder="blur" />
          </button>
        ))}
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
};

export default Gallery;
