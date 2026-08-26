import { Color, GameRules, GameStatus, PieceInfo, PlacedPiece, SquareId } from "../types";
import { ChessPly, ChessPosition } from "./types";
import {
  BOARD,
  initialPosition,
  isSquare,
  placedPieces,
  promotionFromLetter,
  promotionToLetter,
  toFen
} from "./position";
import { applyPly, legalMoves, status } from "./rules";

export const chessRules: GameRules<ChessPosition, ChessPly> = {
  id: "chess",
  shape: BOARD,

  initialPosition,
  colorToMove: (position: ChessPosition): Color => position.toMove,
  placedPieces: (position: ChessPosition): PlacedPiece[] => placedPieces(position),
  capturedPieces: (position: ChessPosition): PieceInfo[] => [...position.captured],

  legalMoves: (position: ChessPosition, from: SquareId): ChessPly[] => legalMoves(position, from),
  applyPly: (position: ChessPosition, ply: ChessPly): ChessPosition | null => applyPly(position, ply),
  status: (position: ChessPosition): GameStatus => status(position),

  serializePly: (ply: ChessPly): string =>
    `${ply.from}${ply.to}${ply.promotion ? promotionToLetter(ply.promotion) : ""}`,

  parsePly: (text: string): ChessPly | null => {
    const from = text.slice(0, 2);
    const to = text.slice(2, 4);

    if (!isSquare(from) || !isSquare(to)) {
      return null;
    }

    if (text.length === 4) {
      return { from, to };
    }

    const promotion = promotionFromLetter(text[4]);

    return text.length === 5 && promotion ? { from, to, promotion } : null;
  },

  checksum: (position: ChessPosition): string => toFen(position)
};

export * from "./types";
export { BOARD, initialPosition, toFen, fromFen, toSquare, toCoord, pieceAt } from "./position";
export { applyPly, legalMoves, legalTargets, allLegalMoves, isCheck, status, isPromotion } from "./rules";
