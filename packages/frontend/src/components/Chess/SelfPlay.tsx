"use client";

import { useEffect } from "react";

import { useChessSession } from "@components/Chess/ChessSession";
import { Color } from "@lib/games/types";

/** Restart rather than watch two lone kings shuffle. */
const MAX_PLIES = 240;

/**
 * Ambient self-play for the widget. Headless — it renders nothing and only
 * drives the session, so the page decides whether a board plays by itself.
 *
 * Each ply reschedules the next one (autoPlay changes identity with the
 * position), which keeps a constant gap between moves rather than a metronome
 * that can fire mid-animation.
 */
const SelfPlay = ({
  moveDelay = 1400,
  restartDelay,
  humanColor = null
}: {
  moveDelay?: number;
  /** Omit to leave a finished game on the board for the Reset button. */
  restartDelay?: number;
  /** The side the engine leaves alone. Null means it plays both. */
  humanColor?: Color | null;
}) => {
  const { autoPlay, reset, status, selected, plies, toMove } = useChessSession();

  useEffect(() => {
    // Insurance against a game that will not resolve itself.
    if (status.state !== "playing" || plies.length >= MAX_PLIES) {
      if (restartDelay === undefined) {
        return;
      }

      const restart = setTimeout(reset, restartDelay);

      return () => clearTimeout(restart);
    }

    // Someone is mid-click; don't move the board out from under them.
    if (selected) {
      return;
    }

    // The visitor has this side. Wait for them, however long that takes.
    if (humanColor && toMove === humanColor) {
      return;
    }

    const next = setTimeout(autoPlay, moveDelay);

    return () => clearTimeout(next);
  }, [autoPlay, reset, status.state, selected, plies.length, moveDelay, restartDelay, humanColor, toMove]);

  return null;
};

export default SelfPlay;
