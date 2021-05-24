import Piece from "./piece";
import square from "./square";
import Square from "./square";

class Move {
  from: square;
  piece: Piece;
  to: square;

  constructor(piece: Piece, squareOn: Square, squareTo: Square) {
    this.piece = piece;
    this.to = squareTo;
    this.from = squareOn;
  }

  get getPiece() {
    return this.piece;
  }

  get getPieceColor() {
    return this.piece.getColor;
  }

  get getSquareFrom() {
    return this.from;
  }

  get getSquareTo() {
    return this.to;
  }

  print() {
    return `${this.from.getNotation}${this.to.getNotation}`;
  }
}

export default Move;
