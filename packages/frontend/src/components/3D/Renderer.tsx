"use client";

import styles from "@styles/Renderer.module.scss";
import { Canvas } from "@react-three/fiber";
import { ReactNode } from "react";

/** Three-quarter view, close enough that the board fills the panel. */
const CAMERA = { position: [1.6, 1.8, 2.0] as [number, number, number], fov: 40 };

/** Fills whatever box it is given — the widget owns the size, not the canvas. */
const Renderer = ({ children, camera = CAMERA }: { children?: ReactNode; camera?: typeof CAMERA }) => (
  <div className={styles.canvas}>
    <Canvas camera={camera} shadows>
      {children}
    </Canvas>
  </div>
);

export default Renderer;
