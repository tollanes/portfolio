"use client";

import ChessBoardRenderer from "@components/Chess/ChessBoardRenderer";
import { ChessProvider } from "@components/Chess/chessProvider";

const ChessGame = () => {
  return (
    <ChessProvider>
      <ChessBoardRenderer />
    </ChessProvider>
  );
};

export default ChessGame;
