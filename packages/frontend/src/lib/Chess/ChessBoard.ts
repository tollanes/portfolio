import { AbstractBoard } from "@lib/BoardGame/Board";
import { AbstractPiece, PieceColor } from "@lib/BoardGame/Piece";
import { BoardPosition, Position } from "@lib/BoardGame/Position";

import Pawn from "@lib/Chess/Pawn";
import Rook from "@lib/Chess/Rook";
import Bishop from "@lib/Chess/Bishop";
import Knight from "@lib/Chess/Knight";
import Queen from "@lib/Chess/Queen";
import King from "@lib/Chess/King";

type ChessPieceClass = new (color: PieceColor, position: Position) => AbstractPiece;

const backRank: ChessPieceClass[] = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

class ChessBoard extends AbstractBoard {
  constructor(gameId: string) {
    super(8, 8, gameId);
  }

  initBoard(): void {
    this.boardPieces = [];
    this.capturedPieces = [];
    this.selectedPiece = undefined;

    backRank.forEach((Piece, file) => {
      this.addPiece(new Piece(PieceColor.White, new BoardPosition(file, 0)));
      this.addPiece(new Pawn(PieceColor.White, new BoardPosition(file, 1)));
      this.addPiece(new Pawn(PieceColor.Black, new BoardPosition(file, 6)));
      this.addPiece(new Piece(PieceColor.Black, new BoardPosition(file, 7)));
    });
  }
}

export default ChessBoard;
