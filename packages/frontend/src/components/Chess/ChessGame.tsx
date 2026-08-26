"use client";

import ChessBoardRenderer from "@components/Chess/ChessBoardRenderer";
import PromotionPrompt from "@components/Chess/PromotionPrompt";
import SelfPlay from "@components/Chess/SelfPlay";
import { ChessSession } from "@components/Chess/ChessSession";

/** One local game. No lobby, no account, no network. */
const ChessGame = () => (
  <ChessSession>
    <SelfPlay />
    <ChessBoardRenderer />
    <PromotionPrompt />
  </ChessSession>
);

export default ChessGame;
