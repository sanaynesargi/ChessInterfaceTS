import Piece from "../piece";

class Knight extends Piece {
  constructor(square: string, color: string) {
    super(square, color);
    this.name = this.isWhite ? "N" : "n";
    this.moveMap = this._setMoveMap();
  }

  _setMoveMap(): string[] {
    let map = [
      "N",
      "CM2D1R1L",
      "N",
      "CM2L1U1D",
      "CM2R1U1D",
      "N",
      "CM2U1R1L",
      "N",
    ];

    return map;
  }
}

export default Knight;
