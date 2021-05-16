import Piece from "../piece";

class Pawn extends Piece {
  firstMove: boolean;
  canCaptureEnPassant: boolean;
  constructor(square: string, color: string) {
    super(square, color);
    this.name = this.isWhite ? "P" : "p";
    this.firstMove = false;
    this.moveMap = this._setMoveMap();
  }

  get getFirstMoveMade() {
    return this.firstMove;
  }

  setFirstMoveMade(): void {
    this.firstMove = true;
  }

  _setMoveMap(): string[] {
    let map = ["CO", "MO", "CO"];

    return map;
  }
}

export default Pawn;
