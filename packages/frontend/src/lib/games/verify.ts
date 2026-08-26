/**
 * Rules harness. No React, no browser, no database — run it with:
 *   npx tsx src/lib/games/verify.ts
 *
 * Positions are given as FEN and moves as UCI, so a failure names the exact
 * ply and the exact expected position.
 */

import { chessRules } from "./chess";
import { ChessPosition } from "./chess/types";
import { allLegalMoves, applyPly, fromFen, initialPosition, isCheck, legalTargets, status, toFen } from "./chess";
import {
  ChessSessionState,
  chessSessionReducer as reduce,
  initialSessionState,
  selectedTargets
} from "./chess/session";

let failures = 0;

const check = (name: string, actual: unknown, expected: unknown) => {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);

  if (!pass) {
    failures++;
  }

  console.log(`${pass ? "PASS" : "FAIL"}  ${name}`);

  if (!pass) {
    console.log(`      expected: ${JSON.stringify(expected)}`);
    console.log(`      actual:   ${JSON.stringify(actual)}`);
  }
};

/** Replays UCI moves onto a position, failing loudly on the first illegal one. */
const replay = (moves: string[], from: ChessPosition = initialPosition()): ChessPosition => {
  let position = from;

  moves.forEach((text, index) => {
    const ply = chessRules.parsePly(text);
    const next = ply && applyPly(position, ply);

    if (!next) {
      throw new Error(`illegal move ${index + 1} (${text}) in position ${toFen(position)}`);
    }

    position = next;
  });

  return position;
};

const perft = (position: ChessPosition, depth: number): number => {
  const moves = allLegalMoves(position);

  if (depth <= 1) {
    return moves.length;
  }

  return moves.reduce((total, ply) => total + perft(applyPly(position, ply)!, depth - 1), 0);
};

// ---------------------------------------------------------------- start ----

check(
  "initial position round-trips through FEN",
  toFen(initialPosition()),
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
);
check("fromFen is the inverse of toFen", toFen(fromFen(toFen(initialPosition()))), toFen(initialPosition()));
check("white has 20 opening moves", allLegalMoves(initialPosition()).length, 20);
check("e2 pawn has two targets", legalTargets(initialPosition(), "e2").sort(), ["e3", "e4"]);
check("black cannot move first", legalTargets(initialPosition(), "e7"), []);

// ----------------------------------------------------------- move rules ----

check(
  "1. e4 sets the en passant square",
  toFen(replay(["e2e4"])),
  "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
);
check(
  "en passant capture removes the passed pawn",
  toFen(replay(["e2e4", "d7d5", "e4e5", "f7f5", "e5f6"])),
  "rnbqkbnr/ppp1p1pp/5P2/3p4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 3"
);
check(
  "kingside castling moves the rook too",
  toFen(replay(["e2e4", "e7e5", "g1f3", "b8c6", "f1c4", "f8c5", "e1g1"])),
  "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4"
);
check(
  "queenside castling moves the rook too",
  toFen(replay(["d2d4", "d7d5", "b1c3", "b8c6", "c1f4", "c8f5", "d1d2", "d8d7", "e1c1"])),
  "r3kbnr/pppqpppp/2n5/3p1b2/3P1B2/2N5/PPPQPPPP/2KR1BNR b kq - 7 5"
);

const promoted = replay(["a7a8q"], fromFen("8/P6k/8/8/8/8/7K/8 w - - 0 1"));
check("promotion places the chosen piece", toFen(promoted), "Q7/7k/8/8/8/8/7K/8 b - - 0 1");
check("underpromotion is offered", legalTargets(fromFen("8/P6k/8/8/8/8/7K/8 w - - 0 1"), "a7"), ["a8"]);
check(
  "a promotion ply without a piece is rejected",
  applyPly(fromFen("8/P6k/8/8/8/8/7K/8 w - - 0 1"), { from: "a7", to: "a8" }),
  null
);

// --------------------------------------------------------------- check ----

const pinned = fromFen("4k3/8/8/8/8/8/4R3/4K3 b - - 0 1");
check("a king cannot step into an attacked file", legalTargets(pinned, "e8").sort(), ["d7", "d8", "f7", "f8"]);
check("moving into check is filtered out", applyPly(pinned, { from: "e8", to: "e7" }), null);

const foolsMate = replay(["f2f3", "e7e5", "g2g4", "d8h4"]);
check("fool's mate is checkmate", status(foolsMate), { state: "checkmate", winner: "Black" });
check("fool's mate leaves white in check", isCheck(foolsMate, "White"), true);
check("checkmate leaves no legal reply", allLegalMoves(foolsMate).length, 0);

const scholarsMate = replay(["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"]);
check("scholar's mate is checkmate", status(scholarsMate), { state: "checkmate", winner: "White" });

const stalemate = replay([
  "e2e3",
  "a7a5",
  "d1h5",
  "a8a6",
  "h5a5",
  "h7h5",
  "a5c7",
  "a6h6",
  "h2h4",
  "f7f6",
  "c7d7",
  "e8f7",
  "d7b7",
  "d8d3",
  "b7b8",
  "d3h7",
  "b8c8",
  "f7g6",
  "c8e6"
]);
check("stalemate is not checkmate", status(stalemate), { state: "stalemate", winner: null });
check("captures are recorded", stalemate.captured.length, 6);

// ---------------------------------------------------------------- perft ----
// Node counts every chess engine is checked against. If move generation is
// wrong anywhere — castling, en passant, promotion, pins — these will not match.

check("perft(1)", perft(initialPosition(), 1), 20);
check("perft(2)", perft(initialPosition(), 2), 400);
check("perft(3)", perft(initialPosition(), 3), 8902);

if (process.argv.includes("--deep")) {
  check("perft(4)", perft(initialPosition(), 4), 197281);
}

// -------------------------------------------------------------- session ----
// The reducer the React provider runs. Tested here so a click sequence can be
// checked without a browser.

const click = (state: ChessSessionState, ...squares: string[]): ChessSessionState =>
  squares.reduce((current, square) => reduce(current, { type: "select", square }), state);

const seed = (fen: string): ChessSessionState => ({
  ...initialSessionState(),
  position: fromFen(fen)
});

check("clicking your own piece selects it", click(initialSessionState(), "e2").selected, "e2");
check("clicking an enemy piece first selects nothing", click(initialSessionState(), "e7").selected, null);
check("a selected piece highlights its targets", selectedTargets(click(initialSessionState(), "e2")).sort(), [
  "e3",
  "e4"
]);

const afterE4 = click(initialSessionState(), "e2", "e4");
check("click-then-click plays the move", toFen(afterE4.position), toFen(replay(["e2e4"])));
check("the ply is recorded", afterE4.plies.length, 1);
check("selection clears after moving", afterE4.selected, null);

const undone = reduce(afterE4, { type: "undo" });
check("undo restores the previous position", toFen(undone.position), toFen(initialPosition()));
check("undo keeps the ply for redo", { plies: undone.plies.length, index: undone.index }, { plies: 1, index: 0 });
check("redo replays it", toFen(reduce(undone, { type: "redo" }).position), toFen(afterE4.position));

const branched = click(undone, "d2", "d4");
check("moving after an undo drops the redo branch", branched.plies.length, 1);

// The old AbstractGame undid by reversing the move, which lost the captured piece.
const captureLine = ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6"].reduce(
  (state, uci) => click(state, uci.slice(0, 2), uci.slice(2, 4)),
  initialSessionState()
);
const afterCapture = click(captureLine, "h5", "f7");
check("a capture is recorded", afterCapture.position.captured.length, 1);
check("undo puts the captured piece back", reduce(afterCapture, { type: "undo" }).position.captured.length, 0);
check(
  "undo restores the piece on its square",
  reduce(afterCapture, { type: "undo" }).position.squares["f7"]?.type,
  "Pawn"
);

const promoting = click(seed("8/P6k/8/8/8/8/7K/8 w - - 0 1"), "a7", "a8");
check("a promoting move waits for a choice", promoting.pendingPromotion, { from: "a7", to: "a8" });
check("the board does not move until it is chosen", toFen(promoting.position), "8/P6k/8/8/8/8/7K/8 w - - 0 1");
check(
  "choosing underpromotion places a knight",
  reduce(promoting, { type: "promote", piece: "Knight" }).position.squares["a8"]?.type,
  "Knight"
);
check(
  "cancelling a promotion leaves the position alone",
  toFen(reduce(promoting, { type: "cancelPromotion" }).position),
  "8/P6k/8/8/8/8/7K/8 w - - 0 1"
);

console.log(failures === 0 ? "\nall checks passed" : `\n${failures} check(s) failed`);
process.exit(failures === 0 ? 0 : 1);
