import { Tile, AbstractTile } from "@lib/BoardGame/Tile";
import { Position, BoardPosition } from "@lib/BoardGame/Position";
import { Piece } from "@lib/BoardGame/Piece";
import { action, makeObservable, observable } from "mobx";

export interface Board {
  get width(): number;
  get height(): number;
  get tiles(): Tile[][];
  get pieces(): Piece[];
  selectedPiece: Piece | undefined;
  getTileAt(position: Position): Tile | undefined;
  getPieceAt(position: Position): Piece | undefined;
  addPiece(piece: Piece): void;
  removePiece(piece: Piece): void;

  initBoard(): void;
  inBounds(position: Position): boolean;
  isValidPosition(position: Position): boolean;
  selectPiece(piece: Piece): void;
  unselectPiece(): void;
  movePiece(from: Position, to: Position): boolean;
  debugPrint(): void;
}

export class AbstractBoard implements Board {
  readonly gameId: string;
  private readonly boardWidth: number;
  private readonly boardHeight: number;
  public readonly boardTiles: Tile[][] = [];
  public boardPieces: Piece[] = [];
  public capturedPieces: Piece[] = [];
  public selectedPiece: Piece | undefined = undefined;

  constructor(width: number, height: number, gameId: string) {
    this.boardWidth = width;
    this.boardHeight = height;
    this.gameId = gameId;

    this.boardTiles = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => new AbstractTile(new BoardPosition(x, y)))
    );

    makeObservable(this, {
      boardPieces: observable,
      boardTiles: observable,
      capturedPieces: observable,
      selectedPiece: observable,
      selectPiece: action,
      unselectPiece: action
    });
  }

  public get width(): number {
    return this.boardWidth;
  }

  public get height(): number {
    return this.boardHeight;
  }

  public get tiles(): Tile[][] {
    return this.boardTiles;
  }

  public get pieces(): Piece[] {
    return this.boardPieces;
  }

  public getTileAt(position: Position): Tile | undefined {
    return this.boardTiles[position.y][position.x];
  }

  public getPieceAt(position: Position): Piece | undefined {
    return this.boardPieces.find((piece) => piece.position.equals(position));
  }

  public addPiece(piece: Piece): void {
    this.boardPieces.push(piece);
  }

  public removePiece(piece: Piece): void {
    this.boardPieces = this.boardPieces.filter((p) => p !== piece);
  }

  public initBoard(): void {
    throw new Error("Method not implemented.");
  }

  public inBounds(position: Position): boolean {
    return position.x >= 0 && position.y >= 0 && position.x < 8 && position.y < 8;
  }

  public isValidPosition(position: Position): boolean {
    return position.x >= 0 && position.x < this.width && position.y >= 0 && position.y < this.height;
  }

  public selectPiece(piece: Piece): void {
    this.selectedPiece = piece;
    this.selectedPiece.generatePossibleMoves(this);
  }

  public unselectPiece(): void {
    this.selectedPiece = undefined;
  }

  public movePiece(from: Position, to: Position): boolean {
    const fromTile = this.getTileAt(from);
    const toTile = this.getTileAt(to);
    const fromPiece = this.getPieceAt(from);
    const toPiece = this.getPieceAt(to);
    if (!fromTile || !toTile || !fromPiece) {
      return false;
    }

    const isSameColor = fromPiece?.color === toPiece?.color;
    const isValidMove = this.isValidPosition(toTile.position);
    const isInBounds = this.inBounds(toTile.position);

    if (!isSameColor && isValidMove && isInBounds) {
      if (toPiece) {
        // capture piece
        toPiece.captured = true;
        this.capturedPieces.push(toPiece);
        this.removePiece(toPiece);
      }

      fromPiece.setPosition(toTile.position);
      this.unselectPiece();
      return true;
    }
    return false;
  }

  public debugPrint(): void {
    let boardRepresentation = "";
    for (let y = this.height - 1; y >= 0; y--) {
      // start from the top row
      for (let x = 0; x < this.width; x++) {
        const tile = this.boardTiles[y][x];
        const piece = this.getPieceAt(tile.position);
        if (piece) {
          // You can replace this with the actual symbol or name of the piece
          boardRepresentation += ` ${piece.toString()} `;
        } else {
          boardRepresentation += " . ";
        }
      }
      boardRepresentation += "\n";
    }
    console.log(boardRepresentation);
  }
}
