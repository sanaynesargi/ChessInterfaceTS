import Piece from "../piece";

class Bishop extends Piece {
  isLightSquaredBishop: boolean;
  constructor(square: string, color: string) {
    super(square, color);
    this.isLightSquaredBishop = this.isWhite;
    this.name = this.isWhite ? "B" : "b";
    this.moveMap = this._setMoveMap();
  }

  get getBishopColor(): string {
    return this.isLightSquaredBishop ? "light" : "dark";
  }

  _setMoveMap(): string[] {
    let map = [];

    for (let j = 0; j < 8; j++) {
      if (j < 4) {
        map.push(j % 2 === 0 ? "CMU" : "N");
      } else {
        map.push("N");
      }
    }

    return map;
  }
}

export default Bishop;
