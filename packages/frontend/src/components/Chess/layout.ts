import { Vector3 } from "three";

import { Color, SquareId } from "@lib/games/types";
import { BOARD, toCoord } from "@lib/games/chess/position";

/** One square, in world units. */
export const SQUARE = 1 / 5;

/** Half the board — the playing surface runs from -EDGE to +EDGE on both axes. */
export const EDGE = 0.7;

/** Clearance between the board edge and the first row of captured pieces. */
export const CAPTURED_GAP = SQUARE * 2;

/** World x comes from the rank, world z from the file. */
export const squareToVector = (square: SquareId): Vector3 => {
  const { x, y } = toCoord(square);

  return new Vector3(y * SQUARE - EDGE, 0, x * SQUARE - EDGE);
};

/**
 * Captured pieces stand off the edge of the board, one row per eight, growing
 * away from the surface. White is taken off the near side, black the far side.
 */
export const capturedToVector = (index: number, color: Color): Vector3 => {
  const column = index % BOARD.width;
  const row = Math.floor(index / BOARD.width);
  const side = color === "White" ? -1 : 1;

  return new Vector3(column * SQUARE - EDGE, 0, side * (EDGE + CAPTURED_GAP + SQUARE * row));
};
