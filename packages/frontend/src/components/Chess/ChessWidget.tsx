"use client";

// Aliased because the handlers below need both React's synthetic events and the
// DOM's own PointerEvent, which share their names.
import {
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState
} from "react";

import styles from "@styles/ChessWidget.module.scss";
import ChessBoardRenderer from "@components/Chess/ChessBoardRenderer";
import PromotionPrompt from "@components/Chess/PromotionPrompt";
import { useChessSession } from "@components/Chess/ChessSession";

/** A press that travelled further than this was an orbit drag, not a click. */
const DRAG_SLOP = 6;

/**
 * The portfolio's corner sprinkle: a self-playing board you can collapse to a
 * strip, or click into — which opens it out and hands you white while the engine
 * keeps answering as black. Chrome only; the session lives above it, so the game
 * keeps playing while hidden.
 */
const ChessWidget = ({
  isPlaying,
  onPlayingChange
}: {
  isPlaying: boolean;
  onPlayingChange: (isPlaying: boolean) => void;
}) => {
  const { status, toMove, plies, reset } = useChessSession();
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // The resize is only worth animating once the panel is on screen at its
  // resting size. See .animated.
  useEffect(() => setIsAnimated(true), []);

  /**
   * Clicking away puts the board back to ambient. Taking a seat is deliberate;
   * leaving it should not have to be, or the widget sits at half the screen
   * while you read the rest of the page.
   *
   * Capture phase, so a handler in between calling stopPropagation cannot leave
   * the widget stuck open.
   */
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) {
        onPlayingChange(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown, true);

    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isPlaying, onPlayingChange]);

  const isOver = status.state !== "playing";

  const label = () => {
    if (status.winner) {
      return `${status.winner} wins`;
    }

    if (status.state === "stalemate") {
      return "Stalemate";
    }

    if (status.state === "draw") {
      return "Draw";
    }

    if (isPlaying && toMove === "White") {
      return "Your move";
    }

    return `${toMove} to move`;
  };

  const hint = () => {
    if (!isOver) {
      return `${plies.length} moves`;
    }

    // An ambient game clears itself; a game someone is playing waits for them.
    return isPlaying ? "Reset to play again" : "Restarting";
  };

  const marker = (
    <span className={`${styles.marker} ${isOver ? styles.over : styles[toMove.toLowerCase()]}`} aria-hidden />
  );

  const onBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    pressedAt.current = { x: event.clientX, y: event.clientY };
  };

  /**
   * Clicking the board takes a seat. OrbitControls also ends a camera drag with
   * a click here, so a press that moved is ignored — otherwise nudging the view
   * would open the panel.
   */
  const onBoardClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const from = pressedAt.current;
    pressedAt.current = null;

    if (isPlaying || !from) {
      return;
    }

    if (Math.hypot(event.clientX - from.x, event.clientY - from.y) > DRAG_SLOP) {
      return;
    }

    onPlayingChange(true);
  };

  if (!isOpen) {
    return (
      <div ref={widgetRef} className={styles.widget}>
        <div
          className={styles.collapsed}
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(true)}
          onKeyDown={(event) => event.key === "Enter" && setIsOpen(true)}
        >
          <span className={styles.label}>
            {marker}
            {label()}
          </span>
          <span className={styles.action}>Show</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={widgetRef} className={styles.widget}>
      <div
        className={[styles.panel, isAnimated && styles.animated, isPlaying && styles.playing].filter(Boolean).join(" ")}
      >
        <div className={styles.header}>
          <span className={styles.label}>
            {marker}
            {label()}
          </span>
          <button type="button" className={styles.action} onClick={() => setIsOpen(false)}>
            Hide
          </button>
        </div>

        <div
          className={`${styles.board} ${isPlaying ? "" : styles.inviting}`}
          onPointerDown={onBoardPointerDown}
          onClick={onBoardClick}
        >
          <ChessBoardRenderer />
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>{hint()}</span>

          {/* The keyboard route to what clicking the board does. */}
          <button
            type="button"
            className={styles.action}
            onClick={() => onPlayingChange(!isPlaying)}
            aria-pressed={isPlaying}
          >
            {isPlaying ? "Resume auto" : "Play white"}
          </button>

          <button type="button" className={`${styles.action} ${styles.strong}`} onClick={reset}>
            Reset
          </button>
        </div>

        <PromotionPrompt />
      </div>
    </div>
  );
};

export default ChessWidget;
