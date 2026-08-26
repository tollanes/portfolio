"use client";

import ChessPiece from "@components/Chess/ChessPiece";
import { useChessSession } from "@components/Chess/ChessSession";
import { squareToVector } from "@components/Chess/layout";

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
