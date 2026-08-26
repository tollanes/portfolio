"use client";

import { OrbitControls } from "@react-three/drei";

/** Aimed at the middle of the playing surface, not the table's origin. */
const Controls = () => <OrbitControls makeDefault target={[0, 0.1, 0]} />;

export default Controls;
