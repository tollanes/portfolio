"use client";

import { useState } from "react";

import ChessWidget from "@components/Chess/ChessWidget";
import SelfPlay from "@components/Chess/SelfPlay";
import { ChessSession } from "@components/Chess/ChessSession";

/**
 * One local game in the corner of the portfolio. No lobby, no account, no
 * network.
 *
 * Whether the visitor has taken a seat lives here rather than in the widget,
 * because it decides two separate things: how large the widget draws, and which
 * side the engine still plays.
 */
const ChessGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <ChessSession>
      <SelfPlay humanColor={isPlaying ? "White" : null} />
      <ChessWidget isPlaying={isPlaying} onPlayingChange={setIsPlaying} />
    </ChessSession>
  );
};

export default ChessGame;
