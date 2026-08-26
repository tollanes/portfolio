"use client";

import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Vector3 } from "three";
import { useState } from "react";

import StandardMesh from "@components/3D/StandardMesh";
import { black, hover, possibleHover, white } from "@components/3D/materials";
import { useChessSession } from "@components/Chess/ChessSession";
import { toCoord } from "@lib/games/chess/position";
import { SquareId } from "@lib/games/types";

const ChessTileMesh = ({ square }: { square: SquareId }) => {
  const { selected, targets, select } = useChessSession();

  const gltf = useLoader(GLTFLoader, "/models/ChessTile.glb");
  const [hovered, setHovered] = useState(false);

  const { x, y } = toCoord(square);
  const isLight = (x + y) % 2 === 0;

  const onHover = (e: any, value: boolean) => {
    e.stopPropagation();
    setHovered(value);
  };

  const material = () => {
    if (hovered) {
      return hover;
    }

    if (square === selected || targets.includes(square)) {
      return possibleHover;
    }

    return isLight ? white : black;
  };

  return (
    <StandardMesh
      onPointerOver={(e) => onHover(e, true)}
      onPointerOut={(e) => onHover(e, false)}
      onClick={() => select(square)}
      gltf={gltf}
      position={new Vector3(y / 5, 0, x / 5)}
      material={material()}
    />
  );
};

export default ChessTileMesh;
