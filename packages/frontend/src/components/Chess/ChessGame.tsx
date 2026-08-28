"use client";

import { useState } from "react";

import ChessWidget from "@components/Chess/ChessWidget";
import SelfPlay from "@components/Chess/SelfPlay";
import { ChessSession } from "@components/Chess/ChessSession";

/** How long a finished ambient game stays on the board before starting over. */
const RESTART_DELAY = 10_000;

/**
 * One local game in the corner of the portfolio. No lobby, no account, no
 * network.
 *
 * Whether the visitor has taken a seat lives here rather than in the widget,
 * because it decides three things: how large the widget draws, which side the
 * engine still plays, and whether a finished game clears itself. Ambient games
 * start over on their own; someone else's game is theirs to reset.
 */
const ChessGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <ChessSession>
      <SelfPlay humanColor={isPlaying ? "White" : null} restartDelay={isPlaying ? undefined : RESTART_DELAY} />
      <ChessWidget isPlaying={isPlaying} onPlayingChange={setIsPlaying} />
    </ChessSession>
  );
};

export default ChessGame;
