class Piece {
  name: string;
  square: any;
  color: string;
  moveMap: Array<string>;
  ligature: any;

  constructor(square: string, color: string) {
    this.square = square;
    this.name;
    this.color = color;
    this.ligature;
    this.moveMap = [];
  }

  get getCompletedMoveMap() {
    if (this.moveMap.length < 8) {
      let fillLength = 8 - this.moveMap.length;
      for (let i = 0; i < fillLength; i++) {
        for (let j = 0; j < fillLength; j++) {}
        this.moveMap.push("N");
      }
    }

    return this.moveMap;
  }

  get getColorSquare(): string {
    return this.color;
  }

  get getName(): string {
    return this.name;
  }

  get getSquare(): string {
    return this.square;
  }

  get getColor(): "white" | "black" {
    if (this.color !== "white" && this.color !== "black") {
      console.log("COLOR OF PIECE INVALID! COLOR: " + this.color);
      return "black";
    }
    return this.color;
  }

  get getMoveMap(): Array<string> {
    return this.moveMap;
  }

  get isWhite(): boolean {
    return this.color === "white" ? true : false;
  }

  get getLigature() {
    let isWhite = this.color !== "white";
    let ligature: string;

    if (!this.name) {
      return ".";
    }

    switch (this.name.toLowerCase()) {
      case "k": {
        ligature = String.fromCharCode(isWhite ? 0x2654 : 0x265a);
        break;
      }
      case "q": {
        ligature = String.fromCharCode(isWhite ? 0x2655 : 0x265b);
        break;
      }
      case "r": {
        ligature = String.fromCharCode(isWhite ? 0x2656 : 0x265c);
        break;
      }
      case "b": {
        ligature = String.fromCharCode(isWhite ? 0x2657 : 0x265d);
        break;
      }
      case "n": {
        ligature = String.fromCharCode(isWhite ? 0x2658 : 0x265e);
        break;
      }
      case "p": {
        ligature = String.fromCharCode(isWhite ? 0x2659 : 0x265f);
        break;
      }
    }

    return ligature;
  }
}

export default Piece;
