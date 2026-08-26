"use client";

import ChessTileMesh from "@components/Chess/ChessTileMesh";
import { BOARD, toSquare } from "@lib/games/chess/position";

const squares = Array.from({ length: BOARD.height }, (_, y) =>
  Array.from({ length: BOARD.width }, (_, x) => toSquare({ x, y }))
).flat();

const ChessTilesMesh = () => (
  <group position={[-0.6, 0, -0.6]}>
    {squares.map((square) => (
      <ChessTileMesh key={square} square={square} />
    ))}
  </group>
);

export default ChessTilesMesh;
