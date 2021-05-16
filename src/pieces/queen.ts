import Piece from "../piece";

class Queen extends Piece {
  constructor(square: string, color: string) {
    super(square, color);
    this.name = this.isWhite ? "Q" : "q";
    this.moveMap = this._setMoveMap();
  }

  _setMoveMap(): string[] {
    let map = [];

    for (let i = 0; i < 8; i++) {
      map.push(`CMU`);
    }

    return map;
  }
}

export default Queen;
