"use client";

import { Vector3 } from "three";

import ChessPiece from "@components/Chess/ChessPiece";
import { useChessSession } from "@components/Chess/ChessSession";
import { toCoord } from "@lib/games/chess/position";
import { SquareId } from "@lib/games/types";

/** Same mapping the old board used: world x from rank, world z from file. */
export const squareToVector = (square: SquareId): Vector3 => {
  const { x, y } = toCoord(square);

  return new Vector3(y / 5 - 0.7, 0, x / 5 - 0.7);
};

const ChessPieces = () => {
  const { pieces, selected, select } = useChessSession();

  return (
    <>
      {pieces.map((piece) => (
        <ChessPiece
          key={piece.id}
          piece={piece}
          position={squareToVector(piece.square)}
          isSelected={selected === piece.square}
          onClick={() => select(piece.square)}
        />
      ))}
    </>
  );
};

export default ChessPieces;
