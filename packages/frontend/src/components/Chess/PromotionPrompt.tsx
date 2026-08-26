"use client";

import { useChessSession } from "@components/Chess/ChessSession";
import { PromotionPiece } from "@lib/games/chess/types";

const CHOICES: PromotionPiece[] = ["Queen", "Rook", "Bishop", "Knight"];

/**
 * A promoting pawn waits for a choice — the session refuses to guess. Plain DOM,
 * so it lives outside the canvas.
 */
const PromotionPrompt = () => {
  const { pendingPromotion, promote, cancelPromotion } = useChessSession();

  if (!pendingPromotion) {
    return null;
  }

  return (
    <div role="dialog" aria-label="Choose a promotion piece">
      {CHOICES.map((piece) => (
        <button key={piece} type="button" onClick={() => promote(piece)}>
          {piece}
        </button>
      ))}
      <button type="button" onClick={cancelPromotion}>
        Cancel
      </button>
    </div>
  );
};

export default PromotionPrompt;
