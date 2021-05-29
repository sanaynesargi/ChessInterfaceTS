import Piece from "src/piece";
import Square from "src/square";
import Move from "./move";

class castleMove extends Move {
  moveNum: number;
  constructor(
    piece: Piece,
    squareOn: Square,
    squareTo: Square,
    moveNum: number
  ) {
    super(piece, squareOn, squareTo);
    this.moveNum = moveNum;
  }
}

export default castleMove;
