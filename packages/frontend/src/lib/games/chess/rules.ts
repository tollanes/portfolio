import { Color, GameStatus, SquareId } from "../types";
import { ChessPiece, ChessPly, ChessPosition } from "./types";
import { attacksFrom, pseudoMoves } from "./moves";
import { findKing, homeRank, initialPosition, opponent, pieceAt, toCoord, toSquare } from "./position";

const CORNERS: Record<Color, { kingSide: SquareId; queenSide: SquareId }> = {
  White: { kingSide: "h1", queenSide: "a1" },
  Black: { kingSide: "h8", queenSide: "a8" }
};

export const isAttacked = (position: ChessPosition, square: SquareId, by: Color): boolean =>
  Object.entries(position.squares).some(
    ([from, piece]) => piece.color === by && attacksFrom(position, from).includes(square)
  );

export const isCheck = (position: ChessPosition, color: Color): boolean => {
  const king = findKing(position, color);

  return king !== null && isAttacked(position, king, opponent(color));
};

const dropCastlingRights = (
  castling: ChessPosition["castling"],
  color: Color,
  side: "kingSide" | "queenSide" | "both"
): ChessPosition["castling"] => ({
  ...castling,
  [color]: {
    kingSide: side === "both" || side === "kingSide" ? false : castling[color].kingSide,
    queenSide: side === "both" || side === "queenSide" ? false : castling[color].queenSide
  }
});

const rightsAfterTouching = (
  castling: ChessPosition["castling"],
  piece: ChessPiece,
  square: SquareId
): ChessPosition["castling"] => {
  if (piece.type === "King") {
    return dropCastlingRights(castling, piece.color, "both");
  }

  if (piece.type !== "Rook") {
    return castling;
  }

  const corners = CORNERS[piece.color];

  if (square === corners.kingSide) {
    return dropCastlingRights(castling, piece.color, "kingSide");
  }

  if (square === corners.queenSide) {
    return dropCastlingRights(castling, piece.color, "queenSide");
  }

  return castling;
};

/**
 * Applies a ply that is already known to be geometrically legal, without
 * checking whether it exposes the king. Only `legalMoves` and `applyPly` may
 * call this — everything else goes through `applyPly`.
 */
const unsafeApply = (position: ChessPosition, ply: ChessPly): ChessPosition => {
  const piece = position.squares[ply.from];
  const squares: Record<SquareId, ChessPiece> = { ...position.squares };
  const from = toCoord(ply.from);
  const to = toCoord(ply.to);

  const isEnPassant = piece.type === "Pawn" && ply.to === position.enPassant;
  const victimSquare = isEnPassant ? toSquare({ x: to.x, y: from.y }) : ply.to;
  const victim = position.squares[victimSquare];

  delete squares[victimSquare];
  delete squares[ply.from];
  squares[ply.to] = ply.promotion ? { ...piece, type: ply.promotion } : piece;

  let castling = rightsAfterTouching(position.castling, piece, ply.from);

  if (victim) {
    castling = rightsAfterTouching(castling, victim, victimSquare);
  }

  // Castling: the king moves two files, the rook jumps to the square it crossed.
  if (piece.type === "King" && Math.abs(to.x - from.x) === 2) {
    const rank = homeRank(piece.color);
    const isKingSide = to.x > from.x;
    const rookFrom = toSquare({ x: isKingSide ? 7 : 0, y: rank });
    const rookTo = toSquare({ x: isKingSide ? 5 : 3, y: rank });

    squares[rookTo] = squares[rookFrom];
    delete squares[rookFrom];
  }

  const isDoublePush = piece.type === "Pawn" && Math.abs(to.y - from.y) === 2;
  const resetsClock = piece.type === "Pawn" || victim !== undefined;

  return {
    squares,
    toMove: opponent(position.toMove),
    castling,
    enPassant: isDoublePush ? toSquare({ x: from.x, y: (from.y + to.y) / 2 }) : null,
    halfmoveClock: resetsClock ? 0 : position.halfmoveClock + 1,
    fullmoveNumber: position.fullmoveNumber + (position.toMove === "Black" ? 1 : 0),
    captured: victim ? [...position.captured, victim] : position.captured
  };
};

const leavesKingSafe = (position: ChessPosition, ply: ChessPly, color: Color): boolean =>
  !isCheck(unsafeApply(position, ply), color);

const canCastleThrough = (position: ChessPosition, ply: ChessPly, color: Color): boolean => {
  const from = toCoord(ply.from);
  const to = toCoord(ply.to);
  const crossed = toSquare({ x: (from.x + to.x) / 2, y: from.y });

  return (
    !isCheck(position, color) && !isAttacked(position, crossed, opponent(color)) && leavesKingSafe(position, ply, color)
  );
};

export const legalMoves = (position: ChessPosition, from: SquareId): ChessPly[] => {
  const piece = pieceAt(position, from);

  if (!piece || piece.color !== position.toMove) {
    return [];
  }

  return pseudoMoves(position, from).filter((ply) => {
    const isCastling = piece.type === "King" && Math.abs(toCoord(ply.to).x - toCoord(ply.from).x) === 2;

    return isCastling ? canCastleThrough(position, ply, piece.color) : leavesKingSafe(position, ply, piece.color);
  });
};

export const allLegalMoves = (position: ChessPosition): ChessPly[] =>
  Object.entries(position.squares)
    .filter(([, piece]) => piece.color === position.toMove)
    .flatMap(([square]) => legalMoves(position, square));

/**
 * The one apply function — click, engine tick, replay and the socket all land
 * here. Returns null for an illegal ply rather than throwing or half-applying.
 */
export const applyPly = (position: ChessPosition, ply: ChessPly): ChessPosition | null => {
  const legal = legalMoves(position, ply.from).find(
    (candidate) => candidate.to === ply.to && candidate.promotion === ply.promotion
  );

  return legal ? unsafeApply(position, legal) : null;
};

const hasInsufficientMaterial = (position: ChessPosition): boolean => {
  const pieces = Object.values(position.squares);

  if (pieces.length > 3) {
    return false;
  }

  return pieces.every((piece) => piece.type === "King" || piece.type === "Bishop" || piece.type === "Knight");
};

export const status = (position: ChessPosition): GameStatus => {
  if (allLegalMoves(position).length === 0) {
    return isCheck(position, position.toMove)
      ? { state: "checkmate", winner: opponent(position.toMove) }
      : { state: "stalemate", winner: null };
  }

  if (position.halfmoveClock >= 100 || hasInsufficientMaterial(position)) {
    return { state: "draw", winner: null };
  }

  return { state: "playing", winner: null };
};

/** Squares a piece may land on — what the view highlights. */
export const legalTargets = (position: ChessPosition, from: SquareId): SquareId[] => [
  ...new Set(legalMoves(position, from).map((ply) => ply.to))
];

export const isPromotion = (position: ChessPosition, ply: ChessPly): boolean =>
  legalMoves(position, ply.from).some((candidate) => candidate.to === ply.to && candidate.promotion !== undefined);

/**
 * Rebuilds a position by applying plies in order. This is how undo works and
 * how a client catches up when it joins a room mid-game. Returns null if the
 * list contains an illegal ply.
 */
export const replay = (plies: readonly ChessPly[], from: ChessPosition = initialPosition()): ChessPosition | null => {
  let position: ChessPosition = from;

  for (const ply of plies) {
    const next = applyPly(position, ply);

    if (!next) {
      return null;
    }

    position = next;
  }

  return position;
};
