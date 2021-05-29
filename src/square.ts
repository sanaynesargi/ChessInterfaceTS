import { BISHOP, EMPTY, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./constants";
import Piece from "./piece";
import getCorrectPiece from "./utils/getPieceBasedonString";

class Square {
  notation: string;
  piece: Piece | string;
  color: string;
  row: number;
  column: number;
  whiteKingSquare: boolean;
  blackKingSquare: boolean;
  pieces: string[];
  pieceColor: "white" | "black" | undefined;

  constructor(
    i: number,
    j: number,
    color: string,
    pieceColor: "white" | "black" | undefined,
    piece: string | undefined
  ) {
    this.color = color;
    this.pieceColor = pieceColor;
    this.row = i;
    this.column = j;
    this.notation = this.setNotation();
    this.piece = this._setPiece(piece ? piece : EMPTY);
    this.pieces = [PAWN, BISHOP, KNIGHT, ROOK, QUEEN, KING, EMPTY];
    this.blackKingSquare = false;
    this.whiteKingSquare = false;
  }

  setPieceColor(color: "white" | "black" | undefined): void {
    this.pieceColor = color;
  }

  setBlackKingSquare(): void {
    this.blackKingSquare = true;
    this.whiteKingSquare = false;
  }

  setWhiteKingSquare(): void {
    this.whiteKingSquare = true;
    this.blackKingSquare = false;
  }

  resetKingSquare(): void {
    this.whiteKingSquare = false;
    this.blackKingSquare = false;
  }

  get getBlackKingSquare(): boolean {
    return this.blackKingSquare;
  }

  get getWhiteKingSquare(): boolean {
    return this.whiteKingSquare;
  }

  _setAsciiPiece() {
    this.asciiPiece = this.getPieceObj.getLigature;
  }

  _setPiece(piece: string): Piece | string {
    if (!this.pieceColor) {
      return EMPTY;
    }
    let newPiece = getCorrectPiece(piece, this.pieceColor, this.notation);
    return newPiece;
  }

  setNotation(): string {
    let letters = new Array<string>(8);
    let notation = "";

    for (let chr = 104, i = 7; chr > 96, i > -1; chr--, i--) {
      letters[i] = String.fromCharCode(chr);
    }

    notation = `${letters[this.column]}${8 - this.row}`;
    return notation;
  }

  setPiece(piece: string): number | void {
    if (!this.pieceColor) {
      if (typeof this.pieceColor === "undefined") {
        this.piece = EMPTY;
      }
      return;
    }
    let newPiece = getCorrectPiece(piece, this.pieceColor, this.notation);
    if (newPiece === EMPTY) {
      return -1;
    }

    this.piece = newPiece;
  }

  capturePiece(to: Square): void | number {
    to.setPieceColor(to.getPieceColor);
  }

  movePiece(to: Square): void | number {
    to.setPieceColor(this.getPieceColor);
    let res = to.setPiece(
      typeof this.piece !== "string" ? this.piece.getName : "EMPTY"
    );

    if (
      typeof this.piece !== "string" &&
      (this.piece.getName === "K" || this.piece.getName === "k")
    ) {
      this.piece.getName === "K"
        ? to.setWhiteKingSquare()
        : to.setBlackKingSquare();
    }

    if (res === -1) {
      return -1;
    }
    this.setPieceColor(undefined);
    this.setPiece(EMPTY);
  }

  get getNotation(): string {
    return this.notation;
  }

  get getAsciiPiece(): string {
    return this.getPieceObj.getLigature;
  }

  get getPieceObj(): Piece {
    if (typeof this.piece !== "string") {
      return this.piece;
    }
    return new Piece("", "");
  }

  get getPiece(): string {
    if (typeof this.piece !== "string" && typeof this.piece !== "undefined") {
      return this.piece.getName;
    } else {
      return this.piece;
    }
  }

  get getPieceColor(): "white" | "black" | undefined {
    return this.pieceColor;
  }

  get getColor(): string {
    return this.color;
  }
}

export default Square;
