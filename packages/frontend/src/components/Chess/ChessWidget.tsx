"use client";

import { useState } from "react";

import styles from "@styles/ChessWidget.module.scss";
import ChessBoardRenderer from "@components/Chess/ChessBoardRenderer";
import PromotionPrompt from "@components/Chess/PromotionPrompt";
import { useChessSession } from "@components/Chess/ChessSession";

/**
 * The portfolio's corner sprinkle: a self-playing board you can collapse to a
 * strip or open into a panel. Chrome only — the session lives above it, so the
 * game keeps playing while hidden.
 */
const ChessWidget = () => {
  const { status, toMove, plies, reset } = useChessSession();
  const [isOpen, setIsOpen] = useState(true);

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

    return `${toMove} to move`;
  };

  const marker = (
    <span className={`${styles.marker} ${isOver ? styles.over : styles[toMove.toLowerCase()]}`} aria-hidden />
  );

  if (!isOpen) {
    return (
      <div className={styles.widget}>
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
    <div className={styles.widget}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.label}>
            {marker}
            {label()}
          </span>
          <button type="button" className={styles.action} onClick={() => setIsOpen(false)}>
            Hide
          </button>
        </div>

        <div className={styles.board}>
          <ChessBoardRenderer />
        </div>

        <div className={styles.footer}>
          <span className={styles.hint}>{isOver ? "Reset to play again" : `${plies.length} moves`}</span>
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
