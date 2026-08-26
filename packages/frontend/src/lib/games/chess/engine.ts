import { ChessPieceType, ChessPly, ChessPosition } from "./types";
import { pieceAt, toCoord } from "./position";
import { allLegalMoves, applyPly, isAttacked, isCheck, status } from "./rules";

/**
 * Ambient self-play for the widget. One ply deep with a look at what the reply
 * would take back — enough that pieces get traded and games finish, and nowhere
 * near an engine. Strength is explicitly not the goal.
 */

const VALUE: Record<ChessPieceType, number> = {
  Pawn: 100,
  Knight: 300,
  Bishop: 320,
  Rook: 500,
  Queen: 900,
  King: 0
};

/** Nudge toward the middle so quiet moves aren't pure noise. */
const centrality = (square: string): number => {
  const { x, y } = toCoord(square);

  return 8 - (Math.abs(x - 3.5) + Math.abs(y - 3.5)) * 2;
};

const evaluate = (position: ChessPosition, ply: ChessPly): number => {
  const mover = pieceAt(position, ply.from);
  const after = applyPly(position, ply);

  if (!mover || !after) {
    return -Infinity;
  }

  let score = centrality(ply.to);

  const captured = after.captured.length > position.captured.length ? after.captured[after.captured.length - 1] : null;

  if (captured) {
    score += VALUE[captured.type];
  }

  if (ply.promotion) {
    score += VALUE[ply.promotion] - VALUE.Pawn;
  }

  // Checkmate is worth everything; only look for it when the move gives check.
  if (isCheck(after, after.toMove)) {
    if (status(after).state === "checkmate") {
      return Infinity;
    }

    score += 40;
  }

  // Landing on a square the opponent attacks risks the piece straight back.
  if (isAttacked(after, ply.to, after.toMove)) {
    score -= VALUE[ply.promotion ?? mover.type] * 0.9;
  }

  return score;
};

/**
 * The best-scoring ply, picked at random among ties so two visits to the page
 * don't watch the same game.
 */
export const choosePly = (position: ChessPosition): ChessPly | null => {
  const moves = allLegalMoves(position);

  if (moves.length === 0) {
    return null;
  }

  const scored = moves.map((ply) => ({ ply, score: evaluate(position, ply) }));
  const best = Math.max(...scored.map((entry) => entry.score));
  const winners = scored.filter((entry) => entry.score === best);

  return winners[Math.floor(Math.random() * winners.length)].ply;
};

/** Uniformly random legal ply. Kept for testing move generation. */
export const randomPly = (position: ChessPosition): ChessPly | null => {
  const moves = allLegalMoves(position);

  return moves.length === 0 ? null : moves[Math.floor(Math.random() * moves.length)];
};
