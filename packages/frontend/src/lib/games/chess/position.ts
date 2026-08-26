import { Color, GridShape, PlacedPiece, SquareId } from "../types";
import { Coord, inBounds } from "../grid";
import { ChessPiece, ChessPieceType, ChessPosition, PromotionPiece } from "./types";

export const BOARD: GridShape = { width: 8, height: 8 };

const FILES = "abcdefgh";

/** y = 0 is white's home rank, so toSquare({x:4,y:0}) === "e1". */
export const toSquare = ({ x, y }: Coord): SquareId => `${FILES[x]}${y + 1}`;

export const toCoord = (square: SquareId): Coord => ({
  x: FILES.indexOf(square[0]),
  y: Number(square.slice(1)) - 1
});

export const isSquare = (square: SquareId): boolean =>
  square.length >= 2 && FILES.includes(square[0]) && inBounds(BOARD, toCoord(square));

export const opponent = (color: Color): Color => (color === "White" ? "Black" : "White");

export const pieceAt = (position: ChessPosition, square: SquareId): ChessPiece | undefined => position.squares[square];

/** +1 for white, -1 for black — pawns are the only direction-aware piece. */
export const forward = (color: Color): number => (color === "White" ? 1 : -1);

export const homeRank = (color: Color): number => (color === "White" ? 0 : 7);
export const pawnRank = (color: Color): number => (color === "White" ? 1 : 6);
export const promotionRank = (color: Color): number => (color === "White" ? 7 : 0);

const BACK_RANK: readonly ChessPieceType[] = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"];

const pieceId = (color: Color, type: ChessPieceType, file: number): string =>
  `${color === "White" ? "w" : "b"}-${type}-${FILES[file]}`;

export const initialPosition = (): ChessPosition => {
  const squares: Record<SquareId, ChessPiece> = {};

  BACK_RANK.forEach((type, file) => {
    for (const color of ["White", "Black"] as const) {
      squares[toSquare({ x: file, y: homeRank(color) })] = { id: pieceId(color, type, file), type, color };
      squares[toSquare({ x: file, y: pawnRank(color) })] = {
        id: pieceId(color, "Pawn", file),
        type: "Pawn",
        color
      };
    }
  });

  return {
    squares,
    toMove: "White",
    castling: {
      White: { kingSide: true, queenSide: true },
      Black: { kingSide: true, queenSide: true }
    },
    enPassant: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    captured: []
  };
};

export const placedPieces = (position: ChessPosition): PlacedPiece[] =>
  Object.entries(position.squares).map(([square, piece]) => ({ ...piece, square }));

export const findKing = (position: ChessPosition, color: Color): SquareId | null => {
  for (const [square, piece] of Object.entries(position.squares)) {
    if (piece.type === "King" && piece.color === color) {
      return square;
    }
  }

  return null;
};

const FEN_LETTERS: Record<ChessPieceType, string> = {
  Pawn: "p",
  Knight: "n",
  Bishop: "b",
  Rook: "r",
  Queen: "q",
  King: "k"
};

export const promotionFromLetter = (letter: string): PromotionPiece | undefined =>
  (({ q: "Queen", r: "Rook", b: "Bishop", n: "Knight" }) as Record<string, PromotionPiece>)[letter];

export const promotionToLetter = (piece: PromotionPiece): string => FEN_LETTERS[piece];

/** Standard FEN. Used as the position checksum for resync, not as history. */
export const toFen = (position: ChessPosition): string => {
  const ranks: string[] = [];

  for (let y = BOARD.height - 1; y >= 0; y--) {
    let rank = "";
    let empty = 0;

    for (let x = 0; x < BOARD.width; x++) {
      const piece = pieceAt(position, toSquare({ x, y }));

      if (!piece) {
        empty++;
        continue;
      }

      if (empty > 0) {
        rank += empty;
        empty = 0;
      }

      const letter = FEN_LETTERS[piece.type];
      rank += piece.color === "White" ? letter.toUpperCase() : letter;
    }

    ranks.push(empty > 0 ? rank + empty : rank);
  }

  const castling =
    [
      position.castling.White.kingSide ? "K" : "",
      position.castling.White.queenSide ? "Q" : "",
      position.castling.Black.kingSide ? "k" : "",
      position.castling.Black.queenSide ? "q" : ""
    ].join("") || "-";

  return [
    ranks.join("/"),
    position.toMove === "White" ? "w" : "b",
    castling,
    position.enPassant ?? "-",
    position.halfmoveClock,
    position.fullmoveNumber
  ].join(" ");
};

const TYPE_BY_LETTER: Record<string, ChessPieceType> = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King"
};

/** Inverse of toFen. Used for resync and for standing a test position up directly. */
export const fromFen = (fen: string): ChessPosition => {
  const [board, toMove, castling, enPassant, halfmove, fullmove] = fen.trim().split(/\s+/);
  const squares: Record<SquareId, ChessPiece> = {};

  board.split("/").forEach((rank, index) => {
    const y = BOARD.height - 1 - index;
    let x = 0;

    for (const character of rank) {
      const skip = Number(character);

      if (!Number.isNaN(skip)) {
        x += skip;
        continue;
      }

      const type = TYPE_BY_LETTER[character.toLowerCase()];
      const color: Color = character === character.toUpperCase() ? "White" : "Black";
      const square = toSquare({ x, y });

      squares[square] = { id: `${color === "White" ? "w" : "b"}-${type}-${square}`, type, color };
      x++;
    }
  });

  return {
    squares,
    toMove: toMove === "b" ? "Black" : "White",
    castling: {
      White: { kingSide: castling.includes("K"), queenSide: castling.includes("Q") },
      Black: { kingSide: castling.includes("k"), queenSide: castling.includes("q") }
    },
    enPassant: enPassant === "-" ? null : enPassant,
    halfmoveClock: Number(halfmove ?? 0),
    fullmoveNumber: Number(fullmove ?? 1),
    captured: []
  };
};
