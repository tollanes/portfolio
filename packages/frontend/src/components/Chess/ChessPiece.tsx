"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Vector3 } from "three";
import { useState } from "react";

import StandardMesh from "@components/3D/StandardMesh";
import { black, hover, selected as selectedMaterial, white } from "@components/3D/materials";
import { PieceInfo } from "@lib/games/types";

/**
 * A piece mesh at a point in the scene. It knows nothing about squares or whose
 * turn it is — the board and the captured shelf decide where it stands.
 */
const ChessPiece = ({
  piece,
  position,
  isSelected = false,
  onClick
}: {
  piece: PieceInfo;
  position: Vector3;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const gltf = useLoader(GLTFLoader, `/models/${piece.type}.glb`);
  const [isHovered, setIsHovered] = useState(false);

  const onHover = (e: any, value: boolean) => {
    e.stopPropagation();
    setIsHovered(value);
  };

  const material = () => {
    if (isSelected) {
      return selectedMaterial;
    }

    if (isHovered && onClick) {
      return hover;
    }

    return piece.color === "White" ? white : black;
  };

  return (
    <StandardMesh
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}
      onClick={onClick}
      gltf={gltf}
      position={position}
      material={material()}
    />
  );
};

export default ChessPiece;
