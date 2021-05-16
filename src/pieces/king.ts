import Piece from "../piece";

class King extends Piece {
  constructor(square: string, color: string) {
    super(square, color);
    this.name = this.isWhite ? "K" : "k";
    this.moveMap = this._setMoveMap();
  }

  _setMoveMap(): string[] {
    let map = [];

    for (let i = 0; i < 8; i++) {
      map.push(`CMO`);
    }

    return map;
  }
}

export default King;
