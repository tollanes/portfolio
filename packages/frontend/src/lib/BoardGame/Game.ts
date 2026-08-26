import { Position } from "@lib/BoardGame/Position";
import { Board } from "@lib/BoardGame/Board";
import { Player } from "@lib/BoardGame/Player";
import { Move, AbstractMove } from "@lib/BoardGame/Move";
import { GameScore } from "@lib/BoardGame/GameScore";

export interface Game {
  get board(): Board;
  get players(): Player[];
  get currentPlayer(): Player;
  get winner(): Player | undefined;
  movePiece(from: Position, to: Position): void;
  undoMove(): void;
  redoMove(): void;
  reset(): void;
}

export class AbstractGame implements Game {
  private readonly gameBoard: Board;
  private readonly gamePlayers: Player[];
  private readonly gameMoves: Move[];
  private readonly gameScore: GameScore;
  public readonly gameId: string;
  private gameMovesIndex: number;

  constructor(gameId: string, gameBoard: Board, gamePlayers: Player[], gameScore: GameScore) {
    this.gameId = gameId;
    this.gameBoard = gameBoard;
    this.gamePlayers = gamePlayers;
    this.gameScore = gameScore;
    this.gameMoves = [];
    this.gameMovesIndex = 0;
  }

  public get board(): Board {
    return this.gameBoard;
  }

  public get players(): Player[] {
    return this.gamePlayers;
  }

  public get currentPlayer(): Player {
    return this.players[this.gameMovesIndex % this.players.length];
  }

  public get winner(): Player | undefined {
    throw new Error("Method not implemented.");
  }

  public movePiece(from: Position, to: Position): void {
    const isLegal = this.board.selectedPiece?.possibleMoves.some((move) => move.to.equals(to));

    if (!isLegal || !this.board.movePiece(from, to)) {
      return;
    }

    // Record the move at the current index, dropping any moves that were undone
    this.gameMoves.splice(this.gameMovesIndex, this.gameMoves.length - this.gameMovesIndex, new AbstractMove(from, to));
    this.gameMovesIndex++;
  }

  public undoMove(): void {
    // Undo move at current index
    if (this.gameMovesIndex > 0) {
      this.gameMovesIndex--;
      const move = this.gameMoves[this.gameMovesIndex];
      this.board.movePiece(move.to, move.from);
    }
  }

  public redoMove(): void {
    // Redo move at current index
    if (this.gameMovesIndex < this.gameMoves.length) {
      const move = this.gameMoves[this.gameMovesIndex];
      this.board.movePiece(move.from, move.to);
      this.gameMovesIndex++;
    }
  }

  public reset(): void {
    throw new Error("Method not implemented.");
  }
}
