import { SquareId } from "../types";
import { ALL_DIRECTIONS, Coord, DIAGONALS, Offset, ORTHOGONALS, inBounds, ray, shift } from "../grid";
import { ChessPiece, ChessPly, ChessPosition, PromotionPiece } from "./types";
import { BOARD, forward, homeRank, pawnRank, pieceAt, promotionRank, toCoord, toSquare } from "./position";

const KNIGHT_OFFSETS: readonly Offset[] = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2]
];

const PROMOTION_PIECES: readonly PromotionPiece[] = ["Queen", "Rook", "Bishop", "Knight"];

const SLIDING_DIRECTIONS: Partial<Record<ChessPiece["type"], readonly Offset[]>> = {
  Bishop: DIAGONALS,
  Rook: ORTHOGONALS,
  Queen: ALL_DIRECTIONS
};

const ply = (from: SquareId, to: SquareId, promotion?: PromotionPiece): ChessPly =>
  promotion ? { from, to, promotion } : { from, to };

const stepTargets = (from: Coord, offsets: readonly Offset[]): Coord[] =>
  offsets.map((offset) => shift(from, offset)).filter((target) => inBounds(BOARD, target));

/**
 * Squares a piece attacks — what matters for check. Deliberately excludes pawn
 * pushes (they capture nothing) and castling (it attacks nothing), which is
 * also what keeps `isAttacked` from recursing back into move generation.
 */
export const attacksFrom = (position: ChessPosition, square: SquareId): SquareId[] => {
  const piece = pieceAt(position, square);

  if (!piece) {
    return [];
  }

  const from = toCoord(square);
  const sliding = SLIDING_DIRECTIONS[piece.type];

  if (sliding) {
    const targets: SquareId[] = [];

    for (const direction of sliding) {
      for (const step of ray(BOARD, from, direction)) {
        targets.push(toSquare(step));

        if (pieceAt(position, toSquare(step))) {
          break;
        }
      }
    }

    return targets;
  }

  if (piece.type === "Knight") {
    return stepTargets(from, KNIGHT_OFFSETS).map(toSquare);
  }

  if (piece.type === "King") {
    return stepTargets(from, ALL_DIRECTIONS).map(toSquare);
  }

  const direction = forward(piece.color);

  return stepTargets(from, [
    [-1, direction],
    [1, direction]
  ]).map(toSquare);
};

const pawnMoves = (position: ChessPosition, square: SquareId, piece: ChessPiece): ChessPly[] => {
  const from = toCoord(square);
  const direction = forward(piece.color);
  const moves: ChessPly[] = [];

  const push = (target: Coord) => {
    const to = toSquare(target);

    if (target.y === promotionRank(piece.color)) {
      moves.push(...PROMOTION_PIECES.map((promotion) => ply(square, to, promotion)));
      return;
    }

    moves.push(ply(square, to));
  };

  const oneAhead = shift(from, [0, direction]);

  if (inBounds(BOARD, oneAhead) && !pieceAt(position, toSquare(oneAhead))) {
    push(oneAhead);

    const twoAhead = shift(from, [0, direction * 2]);

    if (from.y === pawnRank(piece.color) && !pieceAt(position, toSquare(twoAhead))) {
      moves.push(ply(square, toSquare(twoAhead)));
    }
  }

  for (const target of attacksFrom(position, square)) {
    const occupant = pieceAt(position, target);
    const isCapture = occupant && occupant.color !== piece.color;

    if (isCapture || target === position.enPassant) {
      push(toCoord(target));
    }
  }

  return moves;
};

const castlingMoves = (position: ChessPosition, square: SquareId, piece: ChessPiece): ChessPly[] => {
  const rank = homeRank(piece.color);

  // Rights are only ever true while the king sits on its home square.
  if (square !== toSquare({ x: 4, y: rank })) {
    return [];
  }

  const rights = position.castling[piece.color];
  const isEmpty = (x: number) => !pieceAt(position, toSquare({ x, y: rank }));
  const moves: ChessPly[] = [];

  if (rights.kingSide && isEmpty(5) && isEmpty(6)) {
    moves.push(ply(square, toSquare({ x: 6, y: rank })));
  }

  if (rights.queenSide && isEmpty(3) && isEmpty(2) && isEmpty(1)) {
    moves.push(ply(square, toSquare({ x: 2, y: rank })));
  }

  return moves;
};

/**
 * Every move the piece's geometry allows, before asking whether it leaves the
 * king in check. Castling is included here; whether the king walks through an
 * attacked square is settled in rules.ts.
 */
export const pseudoMoves = (position: ChessPosition, square: SquareId): ChessPly[] => {
  const piece = pieceAt(position, square);

  if (!piece) {
    return [];
  }

  if (piece.type === "Pawn") {
    return pawnMoves(position, square, piece);
  }

  const moves = attacksFrom(position, square)
    .filter((target) => pieceAt(position, target)?.color !== piece.color)
    .map((target) => ply(square, target));

  return piece.type === "King" ? [...moves, ...castlingMoves(position, square, piece)] : moves;
};
