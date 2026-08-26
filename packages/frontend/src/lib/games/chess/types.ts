import { Color, PieceInfo, SquareId } from "../types";

/** Capitalised to match the GLB filenames in /public/models and the db enum. */
export type ChessPieceType = "Pawn" | "Knight" | "Bishop" | "Rook" | "Queen" | "King";

export type PromotionPiece = Extract<ChessPieceType, "Queen" | "Rook" | "Bishop" | "Knight">;

export interface ChessPiece extends PieceInfo {
  readonly type: ChessPieceType;
}

export interface CastlingRights {
  readonly kingSide: boolean;
  readonly queenSide: boolean;
}

export interface ChessPosition {
  /** Sparse: only occupied squares are keys. Plain object so it survives JSON. */
  readonly squares: Readonly<Record<SquareId, ChessPiece>>;
  readonly toMove: Color;
  readonly castling: Readonly<Record<Color, CastlingRights>>;
  /** The square a pawn may capture onto this ply, not the pawn's square. */
  readonly enPassant: SquareId | null;
  readonly halfmoveClock: number;
  readonly fullmoveNumber: number;
  readonly captured: readonly ChessPiece[];
}

export interface ChessPly {
  readonly from: SquareId;
  readonly to: SquareId;
  readonly promotion?: PromotionPiece;
}
