"use client";

import ChessWidget from "@components/Chess/ChessWidget";
import SelfPlay from "@components/Chess/SelfPlay";
import { ChessSession } from "@components/Chess/ChessSession";

/** One local game in the corner of the portfolio. No lobby, no account, no network. */
const ChessGame = () => (
  <ChessSession>
    <SelfPlay />
    <ChessWidget />
  </ChessSession>
);

export default ChessGame;
