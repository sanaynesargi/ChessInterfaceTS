import Piece from "../piece";

class Rook extends Piece {
  constructor(square: string, color: string) {
    super(square, color);
    this.name = this.isWhite ? "R" : "r";
    this.moveMap = this._setMoveMap();
  }

  _setMoveMap(): string[] {
    let map = [];

    for (let i = 0; i < 8; i++) {
      if (i < 4) {
        map.push(i % 2 !== 0 ? `CMU` : "N");
      } else {
        map.push("N");
      }
    }

    return map;
  }
}

export default Rook;
