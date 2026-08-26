/**
 * The contract every board game implements. Nothing in here knows about React,
 * the database, or chess in particular — a room process can import this file.
 */

export type Color = "White" | "Black";

/** Opaque to everything but the rules module that minted it ("e4" for chess). */
export type SquareId = string;

export interface PieceInfo {
  /** Stable for the lifetime of a piece, so views can animate rather than remount. */
  readonly id: string;
  readonly type: string;
  readonly color: Color;
}

export interface PlacedPiece extends PieceInfo {
  readonly square: SquareId;
}

export type GameState = "playing" | "checkmate" | "stalemate" | "draw";

export interface GameStatus {
  readonly state: GameState;
  readonly winner: Color | null;
}

/**
 * Board shape for the view. A hex or irregular board replaces this with an
 * explicit square list; every game so far is a rectangle.
 */
export interface GridShape {
  readonly width: number;
  readonly height: number;
}

/**
 * Pure functions over an immutable position. `applyPly` returns a new position
 * or null when the ply is illegal — it never mutates and never throws.
 */
export interface GameRules<TPosition, TPly> {
  readonly id: string;
  readonly shape: GridShape;

  initialPosition(): TPosition;
  colorToMove(position: TPosition): Color;
  placedPieces(position: TPosition): PlacedPiece[];
  capturedPieces(position: TPosition): PieceInfo[];

  legalMoves(position: TPosition, from: SquareId): TPly[];
  applyPly(position: TPosition, ply: TPly): TPosition | null;
  status(position: TPosition): GameStatus;

  serializePly(ply: TPly): string;
  parsePly(text: string): TPly | null;
  /** Position checksum for resync — FEN for chess. */
  checksum(position: TPosition): string;
}
