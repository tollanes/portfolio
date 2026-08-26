"use client";

import { Vector3 } from "three";

import ChessPiece from "@components/Chess/ChessPiece";
import { useChessSession } from "@components/Chess/ChessSession";

/** Captured pieces stand on two shelves beside the board. */
const CapturedPieces = () => {
  const { captured } = useChessSession();

  const shelves = [
    { color: "White" as const, z: -1.1 },
    { color: "Black" as const, z: 1.1 }
  ];

  return (
    <group position={[-0.5, -0.2, 0.7]}>
      {shelves.map(({ color, z }) => (
        <group key={color} position={[0, 0, z]}>
          {captured
            .filter((piece) => piece.color === color)
            .map((piece, index) => (
              <ChessPiece key={piece.id} piece={piece} position={new Vector3(index / 6, 0, 0)} />
            ))}
        </group>
      ))}
    </group>
  );
};

export default CapturedPieces;
