import { GridShape } from "./types";

export interface Coord {
  readonly x: number;
  readonly y: number;
}

export type Offset = readonly [dx: number, dy: number];

export const inBounds = (shape: GridShape, { x, y }: Coord): boolean =>
  x >= 0 && y >= 0 && x < shape.width && y < shape.height;

export const shift = ({ x, y }: Coord, [dx, dy]: Offset): Coord => ({ x: x + dx, y: y + dy });

/** Squares outward from `from` in one direction, stopping at the edge. Blocking is the caller's business. */
export function* ray(shape: GridShape, from: Coord, direction: Offset): Generator<Coord> {
  let current = shift(from, direction);

  while (inBounds(shape, current)) {
    yield current;
    current = shift(current, direction);
  }
}

export const DIAGONALS: readonly Offset[] = [
  [1, 1],
  [1, -1],
  [-1, -1],
  [-1, 1]
];

export const ORTHOGONALS: readonly Offset[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0]
];

export const ALL_DIRECTIONS: readonly Offset[] = [...ORTHOGONALS, ...DIAGONALS];
