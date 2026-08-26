"use client";

import { useEffect } from "react";

import { useChessSession } from "@components/Chess/ChessSession";

/**
 * Ambient self-play for the widget. Headless — it renders nothing and only
 * drives the session, so the page decides whether a board plays by itself.
 *
 * Each ply reschedules the next one (playRandom changes identity with the
 * position), which keeps a constant gap between moves rather than a metronome
 * that can fire mid-animation.
 */
const SelfPlay = ({ moveDelay = 1400, restartDelay = 5000 }: { moveDelay?: number; restartDelay?: number }) => {
  const { playRandom, reset, status, selected } = useChessSession();

  useEffect(() => {
    if (status.state !== "playing") {
      const restart = setTimeout(reset, restartDelay);

      return () => clearTimeout(restart);
    }

    // Someone is mid-click; don't move the board out from under them.
    if (selected) {
      return;
    }

    const next = setTimeout(playRandom, moveDelay);

    return () => clearTimeout(next);
  }, [playRandom, reset, status.state, selected, moveDelay, restartDelay]);

  return null;
};

export default SelfPlay;
