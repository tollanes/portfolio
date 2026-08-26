import { GameStatus, SquareId } from "../types";
import { ChessPly, ChessPosition, PromotionPiece } from "./types";
import { initialPosition, pieceAt } from "./position";
import { applyPly, legalMoves, replay, status } from "./rules";

/**
 * One local game of chess: the plies played, where we are in them, and what the
 * player has clicked. Pure — no React, no network. The room process will drive
 * the same reducer with remote plies.
 */
export interface ChessSessionState {
  readonly position: ChessPosition;
  readonly plies: readonly ChessPly[];
  /** How many plies are applied. Less than plies.length after an undo. */
  readonly index: number;
  readonly selected: SquareId | null;
  /** Set when a move needs a promotion choice before it can be committed. */
  readonly pendingPromotion: { readonly from: SquareId; readonly to: SquareId } | null;
}

export type ChessAction =
  | { type: "select"; square: SquareId }
  | { type: "clearSelection" }
  | { type: "move"; ply: ChessPly }
  | { type: "promote"; piece: PromotionPiece }
  | { type: "cancelPromotion" }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset" };

export const initialSessionState = (): ChessSessionState => ({
  position: initialPosition(),
  plies: [],
  index: 0,
  selected: null,
  pendingPromotion: null
});

/** Applies a ply and drops any plies that had been undone. */
const commit = (state: ChessSessionState, ply: ChessPly): ChessSessionState => {
  const position = applyPly(state.position, ply);

  if (!position) {
    return state;
  }

  return {
    position,
    plies: [...state.plies.slice(0, state.index), ply],
    index: state.index + 1,
    selected: null,
    pendingPromotion: null
  };
};

const attemptMove = (state: ChessSessionState, from: SquareId, to: SquareId): ChessSessionState => {
  const candidates = legalMoves(state.position, from).filter((ply) => ply.to === to);

  if (candidates.length === 0) {
    return { ...state, selected: null };
  }

  // A promoting pawn yields one candidate per promotion piece — ask before committing.
  if (candidates[0].promotion) {
    return { ...state, selected: from, pendingPromotion: { from, to } };
  }

  return commit(state, candidates[0]);
};

const rewind = (state: ChessSessionState, index: number): ChessSessionState => {
  const position = replay(state.plies.slice(0, index));

  if (!position) {
    return state;
  }

  return { ...state, position, index, selected: null, pendingPromotion: null };
};

export const chessSessionReducer = (state: ChessSessionState, action: ChessAction): ChessSessionState => {
  switch (action.type) {
    case "select": {
      if (state.pendingPromotion) {
        return state;
      }

      const piece = pieceAt(state.position, action.square);

      // Clicking your own piece always re-targets the selection, never moves onto it.
      if (piece && piece.color === state.position.toMove) {
        return { ...state, selected: action.square };
      }

      return state.selected ? attemptMove(state, state.selected, action.square) : state;
    }

    case "clearSelection":
      return state.selected ? { ...state, selected: null } : state;

    case "move":
      return state.pendingPromotion ? state : commit(state, action.ply);

    case "promote": {
      if (!state.pendingPromotion) {
        return state;
      }

      const { from, to } = state.pendingPromotion;

      return commit(state, { from, to, promotion: action.piece });
    }

    case "cancelPromotion":
      return { ...state, selected: null, pendingPromotion: null };

    case "undo":
      return state.index === 0 ? state : rewind(state, state.index - 1);

    case "redo":
      return state.index >= state.plies.length ? state : rewind(state, state.index + 1);

    case "reset":
      return initialSessionState();

    default:
      return state;
  }
};

export const selectedTargets = (state: ChessSessionState): SquareId[] =>
  state.selected ? [...new Set(legalMoves(state.position, state.selected).map((ply) => ply.to))] : [];

export const sessionStatus = (state: ChessSessionState): GameStatus => status(state.position);
