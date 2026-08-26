"use client";

import { createContext, ReactNode, useCallback, useContext, useMemo, useReducer } from "react";

import { Color, GameStatus, PieceInfo, PlacedPiece, SquareId } from "@lib/games/types";
import { ChessPly, PromotionPiece } from "@lib/games/chess/types";
import { placedPieces } from "@lib/games/chess/position";
import { randomPly } from "@lib/games/chess/engine";
import {
  ChessSessionState,
  chessSessionReducer,
  initialSessionState,
  selectedTargets,
  sessionStatus
} from "@lib/games/chess/session";

export interface ChessSessionValue extends ChessSessionState {
  /** Squares the selected piece may land on — what the board highlights. */
  targets: SquareId[];
  status: GameStatus;
  toMove: Color;
  pieces: PlacedPiece[];
  captured: PieceInfo[];
  canUndo: boolean;
  canRedo: boolean;

  select: (square: SquareId) => void;
  clearSelection: () => void;
  move: (ply: ChessPly) => void;
  promote: (piece: PromotionPiece) => void;
  cancelPromotion: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  /** One ambient self-play ply. The caller owns the timer. */
  playRandom: () => void;
}

const ChessSessionContext = createContext<ChessSessionValue | null>(null);

/**
 * One instance per tree — the corner widget and /minigames/chess each get their
 * own. Nothing here knows about lobbies, seats, or the database.
 */
export const ChessSession = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(chessSessionReducer, undefined, initialSessionState);

  const select = useCallback((square: SquareId) => dispatch({ type: "select", square }), []);
  const clearSelection = useCallback(() => dispatch({ type: "clearSelection" }), []);
  const move = useCallback((ply: ChessPly) => dispatch({ type: "move", ply }), []);
  const promote = useCallback((piece: PromotionPiece) => dispatch({ type: "promote", piece }), []);
  const cancelPromotion = useCallback(() => dispatch({ type: "cancelPromotion" }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  const playRandom = useCallback(() => {
    const ply = randomPly(state.position);

    if (ply) {
      dispatch({ type: "move", ply });
    }
  }, [state.position]);

  const value = useMemo<ChessSessionValue>(
    () => ({
      ...state,
      targets: selectedTargets(state),
      status: sessionStatus(state),
      toMove: state.position.toMove,
      pieces: placedPieces(state.position),
      captured: [...state.position.captured],
      canUndo: state.index > 0,
      canRedo: state.index < state.plies.length,
      select,
      clearSelection,
      move,
      promote,
      cancelPromotion,
      undo,
      redo,
      reset,
      playRandom
    }),
    [state, select, clearSelection, move, promote, cancelPromotion, undo, redo, reset, playRandom]
  );

  return <ChessSessionContext.Provider value={value}>{children}</ChessSessionContext.Provider>;
};

export const useChessSession = (): ChessSessionValue => {
  const session = useContext(ChessSessionContext);

  if (!session) {
    throw new Error("useChessSession must be used inside <ChessSession>");
  }

  return session;
};
