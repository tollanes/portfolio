"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import StandardMesh from "@components/3D/StandardMesh";
import { woodDark } from "@lib/BoardGame/Materials";

const ChessBoardBaseMesh = () => {
  const gltf = useLoader(GLTFLoader, "/models/ChessTable.glb");

  return <StandardMesh gltf={gltf} material={woodDark} />;
};

export default ChessBoardBaseMesh;
