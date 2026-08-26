import { ChessPly, ChessPosition } from "./types";
import { allLegalMoves } from "./rules";

/**
 * Ambient self-play for the portfolio widget. Deliberately not an engine — the
 * kernel notes call for legal moves, not strength. Kept out of the reducer so
 * the reducer stays pure.
 */
export const randomPly = (position: ChessPosition): ChessPly | null => {
  const moves = allLegalMoves(position);

  return moves.length === 0 ? null : moves[Math.floor(Math.random() * moves.length)];
};
