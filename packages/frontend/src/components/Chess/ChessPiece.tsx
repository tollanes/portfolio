"use client";

import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Euler, Group, Vector3 } from "three";
import { useEffect, useRef, useState } from "react";

import StandardMesh from "@components/3D/StandardMesh";
import { black, hover, selected as selectedMaterial, white } from "@components/3D/materials";
import { PieceInfo } from "@lib/games/types";

/** The models face up the board, so black turns to meet white. */
const FACING: Record<string, Euler> = {
  White: new Euler(0, 0, 0),
  Black: new Euler(0, Math.PI, 0)
};

/** Fraction of the remaining distance left after one second — lower glides faster. */
const SETTLE = 0.0005;

/**
 * Where each piece was last drawn, by piece id. A moved piece is re-keyed to the
 * end of the position object, so React reorders it and R3F re-attaches the mesh
 * — without this the piece would restart at its destination and never animate.
 */
const lastDrawn = new Map<string, Vector3>();

/**
 * A piece mesh at a point in the scene. It knows nothing about squares or whose
 * turn it is — the board and the captured shelf decide where it stands.
 *
 * The group's position is animated in useFrame rather than set from props:
 * React re-applies a position prop on every render, which would snap the piece
 * to its destination instead of moving it there.
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
  const group = useRef<Group>(null);

  // Resume from wherever this piece was last drawn, not from its destination.
  useEffect(() => {
    group.current?.position.copy(lastDrawn.get(piece.id) ?? position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (!group.current) {
      return;
    }

    if (!group.current.position.equals(position)) {
      group.current.position.lerp(position, 1 - Math.pow(SETTLE, delta));
    }

    lastDrawn.set(piece.id, group.current.position);
  });

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
    <group ref={group}>
      <StandardMesh
        onPointerOver={(e) => onHover(e, true)}
        onPointerOut={(e) => onHover(e, false)}
        onClick={onClick}
        gltf={gltf}
        rotation={FACING[piece.color]}
        material={material()}
      />
    </group>
  );
};

export default ChessPiece;
