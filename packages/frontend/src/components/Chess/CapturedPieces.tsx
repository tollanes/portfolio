"use client";

import ChessPiece from "@components/Chess/ChessPiece";
import { useChessSession } from "@components/Chess/ChessSession";
import { capturedToVector } from "@components/Chess/layout";
import { Color } from "@lib/games/types";

const SIDES: Color[] = ["White", "Black"];

const CapturedPieces = () => {
  const { captured } = useChessSession();

  return (
    <>
      {SIDES.map((color) =>
        captured
          .filter((piece) => piece.color === color)
          .map((piece, index) => <ChessPiece key={piece.id} piece={piece} position={capturedToVector(index, color)} />)
      )}
    </>
  );
};

export default CapturedPieces;
