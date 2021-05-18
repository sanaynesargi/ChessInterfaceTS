import { BISHOP, EMPTY, KING, KNIGHT, PAWN, QUEEN, ROOK } from "./constants";
import Move from "./move";
import Piece from "./piece";
import Square from "./square";
import flattenRank from "./utils/flattenRank";
import getConsecutiveEmptySquares from "./utils/getConsecutiveEmptySquares";

class Board {
  PAWN: string;
  BISHOP: string;
  KNIGHT: string;
  ROOK: string;
  QUEEN: string;
  KING: string;
  EMPTY: string;

  board: Array<Array<Square>>;
  pieces: Array<string>;
  moves: Array<Move>;
  isCheckMate: boolean;
  isStaleMate: boolean;
  halfmoveClock: number;
  fullMoveClock: number;
  turn: number;
  canWhiteCastleKPerm: boolean;
  canWhiteCastleQPerm: boolean;
  canBlackCastleKPerm: boolean;
  canBlackCastleQPerm: boolean;
  result: string;
  fen: string;
  enPassantSquare: string;
  canWhiteCastleKTemp: boolean;
  canWhiteCastleQTemp: boolean;
  canBlackCastleKTemp: boolean;
  canBlackCastleQTemp: boolean;

  constructor() {
    this.PAWN = PAWN;
    this.BISHOP = BISHOP;
    this.KNIGHT = KNIGHT;
    this.ROOK = ROOK;
    this.QUEEN = QUEEN;
    this.KING = KING;
    this.EMPTY = EMPTY;

    this.board = [
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
      new Array(8),
    ];

    this.pieces = [
      this.ROOK,
      this.KNIGHT,
      this.BISHOP,
      this.KING,
      this.QUEEN,
      this.PAWN,
    ];

    this.moves = [];
    this.fen;

    this.turn = 0;
    this.canWhiteCastleKPerm = true;
    this.canWhiteCastleQPerm = true;
    this.canBlackCastleKPerm = true;
    this.canBlackCastleQPerm = true;
    this.canWhiteCastleKTemp = true;
    this.canWhiteCastleQTemp = true;
    this.canBlackCastleKTemp = true;
    this.canBlackCastleQTemp = true;

    this.isCheckMate = false;
    this.isStaleMate = false;
    this.result = "_";
    this.halfmoveClock = 0;
    this.fullMoveClock = 1;

    this.enPassantSquare = "";
  }

  get getPlayedMoves(): Array<Move> {
    return this.moves;
  }

  get getPlayerTurn(): string {
    return this.turn === 0 ? "white" : "black";
  }

  get getNumberOfMoves(): number {
    return this.fullMoveClock;
  }

  get getHalfmoveClock(): number {
    return this.halfmoveClock;
  }

  _setBoardFEN(pwnSquare?: string) {
    let fen: string = "";

    // add board to FEN
    for (let i = 0; i < this.board.length; i++) {
      let rank = flattenRank(this.board[i]);
      console.log(rank);
      let fenRank: string = "";
      let j = 0;
      while (j < rank.length) {
        if (rank[j] !== this.EMPTY) {
          fenRank += rank[j];
          j += 1;
        } else {
          let emptySquareCount = getConsecutiveEmptySquares(rank, j);
          fenRank += emptySquareCount.toString();
          j += emptySquareCount;
        }
      }
      fenRank += i !== this.board.length - 1 ? "/" : ""; // don't add '/' at the end of board representation
      fen += fenRank;
    }

    // add turn
    fen += ` ${this.turn === 0 ? "w" : "b"} `;

    // add castling rights
    let castleString = "";

    if (!this.canWhiteCastleKPerm && !this.canWhiteCastleQPerm) {
      castleString += "-";
    } else if (!this.canWhiteCastleKPerm && this.canWhiteCastleQPerm) {
      castleString += "Q";
    } else if (!this.canWhiteCastleQPerm && this.canWhiteCastleKPerm) {
      castleString += "K";
    } else {
      castleString += "KQ";
    }

    if (!this.canBlackCastleKPerm && !this.canBlackCastleQPerm) {
      castleString += "-";
    } else if (!this.canBlackCastleKPerm && this.canBlackCastleQPerm) {
      castleString += "q";
    } else if (!this.canBlackCastleQPerm && this.canBlackCastleKPerm) {
      castleString += "k";
    } else {
      castleString += "kq";
    }

    fen += castleString;

    // en passant target square
    fen += ` ${!pwnSquare ? "-" : pwnSquare}`;

    // move clocks
    fen += ` ${this.halfmoveClock} ${this.fullMoveClock}`;

    console.log(fen);

    this.fen = fen;
  }

  _setBoardByFEN(fen: string) {
    // setup board
    const slicedFEN = fen.slice(0, 49);

    if (/\s/.test(slicedFEN)) {
      throw new Error("INVALID FEN");
    }

    const rankStrings = slicedFEN.split("/");

    let isWhiteSquare = false;
    for (let i = 0; i < rankStrings.length; i++) {
      let rank = rankStrings[i];
      let j = 0;
      for (const c of rank) {
        let color = isWhiteSquare ? "white" : "black";
        if (isNaN(c)) {
          let pieceColor = c.toLowerCase() === c ? "black" : "white";
          this.board[i][j] = new Square(i, j, color, pieceColor, c);
          j++;
        } else {
          let n = parseInt(c);
          for (let k = 0; k < n; k++) {
            this.board[i][j] = new Square(i, j, color, undefined, undefined);
            j++;
          }
        }
        isWhiteSquare = !isWhiteSquare;
      }
      isWhiteSquare = !isWhiteSquare;
    }

    // set turn
    const turn = fen.slice(50, 51) === "w" ? 0 : 1;
    this.turn = turn;

    // set castling rights
    const castleRights = fen.slice(52, 56);

    for (const castleDir of castleRights) {
      if (castleDir !== "-") {
        continue;
      }

      switch (castleRights.indexOf(castleDir)) {
        case 0: {
          this.canWhiteCastleKPerm = false;
          break;
        }
        case 1: {
          this.canWhiteCastleQPerm = false;
          break;
        }
        case 2: {
          this.canBlackCastleKPerm = false;
          break;
        }
        case 3: {
          this.canBlackCastleQPerm = false;
          break;
        }
      }
    }

    // add en passant target square
    this.enPassantSquare = fen.slice(57, 58) !== "-" ? fen.slice(57, 58) : "";

    // set move clocks
    this.halfmoveClock = parseInt(fen.slice(59, 60));
    this.fullMoveClock = parseInt(fen.slice(61, 62));

    this.fen = fen;
  }

  setBoard(fen?: string): void {
    // if we get an fen for a position set that as the board instead of the staring position
    if (fen) {
      this._setBoardByFEN(fen);
      return;
    }

    let back_rank = [
      this.ROOK,
      this.KNIGHT,
      this.BISHOP,
      this.QUEEN,
      this.KING,
      this.BISHOP,
      this.KNIGHT,
      this.ROOK,
    ];

    let isWhite = true;

    for (let i = 0; i < 8; i++) {
      let isLastRank = i < 4;
      for (let j = 0; j < 8; j++) {
        if (i === 0 || i === 7) {
          this.board[i][j] = new Square(
            i,
            j,
            isWhite ? "white" : "black",
            isLastRank ? "black" : "white",
            isLastRank ? back_rank[j].toLowerCase() : back_rank[j]
          );
        } else if (i === 1 || i === 6) {
          this.board[i][j] = new Square(
            i,
            j,
            isWhite ? "white" : "black",
            isLastRank ? "black" : "white",
            isLastRank ? this.PAWN.toLowerCase() : this.PAWN
          );
        } else {
          this.board[i][j] = new Square(
            i,
            j,
            isWhite ? "white" : "black",
            undefined,
            undefined
          );
        }

        isWhite = !isWhite;
      }
      isWhite = !isWhite;
    }
    this._setBoardFEN();
  }

  resetBoard() {
    this.setBoard();
    this.moves = [];
  }

  _constructFlatBoard() {
    let flatBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = this.board.length - 1; j > -1; j--) {
        flatBoard.push(this._notationToNumber(this.board[j][i].getNotation));
      }
    }

    return flatBoard;
  }

  _notationToNumber(notation: string): number {
    return parseInt(`${notation.charCodeAt(0)}${notation[1]}`);
  }

  _numberToIndices(num: number): Array<number> {
    return [Math.abs((num % 10) - 8), Math.abs(Math.floor(num / 10) - 97)];
  }

  _binarySearchNotation(board: Array<number>, notation: string): number {
    if (
      this._notationToNumber(notation) > board[Math.floor(board.length / 2)]
    ) {
      return this._binarySearchNotation(
        board.slice(Math.floor(board.length / 2), board.length),
        notation
      );
    } else if (
      this._notationToNumber(notation) < board[Math.floor(board.length / 2)]
    ) {
      return this._binarySearchNotation(
        board.slice(0, Math.floor(board.length / 2)),
        notation
      );
    } else if (
      this._notationToNumber(notation) === board[Math.floor(board.length / 2)]
    ) {
      return board[Math.floor(board.length / 2)];
    } else {
      return -1;
    }
  }

  _get_neighbors(notation: string): Array<string> {
    let num = this._notationToNumber(notation);
    let i = parseInt(num.toString().slice(0, -1));
    let j = parseInt(num.toString().slice(-1));
    let neighbors = [];

    for (let k = j + 1; k > j - 2; k--) {
      for (let l = i - 1; l < i + 2; l++) {
        let not = parseInt(`${l}${k}`);
        if (num === not) {
          continue;
        }

        if (l < 97 || l > 104) {
          continue;
        }
        neighbors.push(`${l}${k}`);
      }
    }
    neighbors = neighbors.filter((item) => !item.includes("-1"));
    neighbors = neighbors.filter(
      (item) => !(parseInt(item.slice(-1)) < 1 || parseInt(item.slice(-1)) > 8)
    );

    return neighbors;
  }

  async _getSquaresInDirection(
    on: string,
    dir: string | undefined,
    color: "white" | "black"
  ) {
    if (!dir) {
      return;
    }

    let squareOn = this._notationToNumber(on).toString();
    // get direction
    // TODO: switch x and y to see if there is a difference same with equation
    let diffX: number;
    let diffY: number;

    //console.log("MY COLOR: ", color);

    if (color === "white") {
      diffX = parseInt(dir.slice(0, -1)) - parseInt(squareOn.slice(0, -1));
      diffY = parseInt(dir.slice(-1)) - parseInt(squareOn.slice(-1));
    } else {
      diffX = parseInt(dir.slice(0, -1)) - parseInt(squareOn.slice(0, -1));
      diffY = parseInt(dir.slice(-1)) - parseInt(squareOn.slice(-1));
    }

    let illegalSquare = false;
    let curr = parseInt(dir);
    let squares: Array<Square> = [];

    // if (dir === "1036") {
    //   console.log(dir, squareOn);
    //   console.log("X: " + diffX);
    //   console.log("Y: " + diffY);
    // }
    // //console.log(diffY, diffX, squareOn, dir);
    while (!illegalSquare) {
      let currSq = this._notationToSquare(curr);

      if (!currSq) {
        break;
      }

      if (
        currSq.getPieceObj.color !== "" &&
        currSq.getPieceObj.getColor === color
      ) {
        break;
      }

      squares.push(currSq);

      if (currSq.getNotation.charCodeAt(0) === 97) {
        break;
      } else if (parseInt(currSq.getNotation.slice(-1)) === 1) {
        break;
      }
      curr = parseInt(
        (parseInt(curr.toString().slice(0, -1)) + diffX)
          .toString()
          .concat((parseInt(curr.toString().slice(-1)) + diffY).toString())
      );
    }

    //console.log(squares);
    return squares;
  }

  _parseDirections(
    squareOn: string,
    direction: string,
    color: "white" | "black"
  ): string | number {
    let directions = ["U", "D", "L", "R"];
    let d!: number | string;

    directions.forEach((dir) => {
      let colorCoefficient: number;
      let directionConstant: number;
      if (direction.includes(dir) && directions.indexOf(dir) > 1) {
        if (color === "white") {
          colorCoefficient = dir === "R" ? -1 : 1;
        } else {
          colorCoefficient = dir === "R" ? 1 : -1;
        }
        directionConstant = parseInt(direction[0]) * colorCoefficient;

        d = String.fromCharCode(squareOn.charCodeAt(0) + directionConstant);
      } else if (direction.includes(dir) && directions.indexOf(dir) < 2) {
        if (color === "white") {
          colorCoefficient = dir === "D" ? -1 : 1;
        } else {
          colorCoefficient = dir === "D" ? 1 : -1;
        }

        directionConstant = parseInt(direction[0]) * colorCoefficient;
        d = parseInt(squareOn.slice(-1)) + directionConstant;
      }
    });
    //console.log(squareOn, direction, d);
    if (typeof d === "number" && (d > 8 || d < 1)) {
      return -10;
    }
    if (
      typeof d === "string" &&
      (d.charCodeAt(0) < 97 || d.charCodeAt(0) > 104)
    ) {
      return -10;
    }
    return d;
  }

  _checkKnightMoveArray(
    arr: Array<string | number | undefined>
  ): Array<Array<string | number> | boolean> {
    let types: Array<string> = [];
    let newArr: Array<string | number> = [];

    arr.forEach((elem) => {
      types.push(typeof elem);
      if (typeof elem !== "undefined") {
        newArr.push(elem);
      }
    });

    return [newArr, types.includes("number") && types.includes("string")];
  }

  async _parseMoveMap(piece: Piece) {
    if (!piece.getMoveMap) {
      console.log("NO MOVE MAP FOUND!");
    }

    const moveMap = piece.getCompletedMoveMap;
    let newMoveMap: Array<string[]> = [[], [], []];

    const movableSquares = {
      captureOnly: Array<Square>(),
      moveOnly: Array<Square>(),
      moveAndCapture: Array<Square>(),
    };
    const squareOn = piece.getSquare;

    const oneSqaure = "O";
    const captureSquare = "C";
    const moveSquare = "M";
    const unlimitedSquares = "U";

    // KNIGHT MOVES HERE
    if (piece.getName.toLowerCase() === "n") {
      let possibleSquares = [];
      // loop over each knight leap and get possible squares
      for (let i = 0; i < moveMap.length; i++) {
        if (moveMap[i] === "N") {
          continue;
        }

        let direction: string;
        let start = 2;
        let stop = 4;
        let squareFragments = [];
        let discoveredSquares;
        while (stop <= 8) {
          direction = moveMap[i].slice(start, stop);
          discoveredSquares = this._parseDirections(
            squareOn,
            direction,
            piece.getColor
          );
          squareFragments.push(
            discoveredSquares !== -10 ? discoveredSquares : undefined
          );
          start += 2;
          stop += 2;
        }

        let [moveFrags, res] = this._checkKnightMoveArray(squareFragments);
        //  console.log(squareFragments, res, moveFrags);

        if (!res) {
          continue;
        }

        if (Array.isArray(moveFrags) && moveFrags.length === 2) {
          let square = `${moveFrags[0]}${moveFrags[1]}`;
          possibleSquares.push(square);
        } else if (Array.isArray(moveFrags) && moveFrags.length === 3) {
          possibleSquares.push(`${moveFrags[1]}${moveFrags[0]}`);
          possibleSquares.push(`${moveFrags[2]}${moveFrags[0]}`);
        }
      }
      // ELIMINATE USED possibleSquares
      for (let sq = 0; sq < possibleSquares.length; sq++) {
        let boardSquare = this._notationToSquare(
          this._notationToNumber(possibleSquares[sq])
        );

        if (!boardSquare) {
          continue;
        }

        if (boardSquare.getPiece !== this.EMPTY) {
          if (boardSquare.getPieceObj.getColor !== piece.color) {
            movableSquares.moveAndCapture.push(boardSquare);
          }
        } else {
          movableSquares.moveAndCapture.push(boardSquare);
        }
      }
      return movableSquares;
    }

    for (let i = 0; i < moveMap.length; i++) {
      if (piece.getColor === "white") {
        newMoveMap[i < 3 ? 0 : i > 4 ? 2 : 1].push(moveMap[i]);
      } else {
        newMoveMap[i < 3 ? 2 : i > 4 ? 0 : 1].push(moveMap[i]);
      }
    }

    //console.log("MOVEMAP: " + newMoveMap);
    let neighbors = this._get_neighbors(squareOn);
    let newNeighbors: Array<Array<string | undefined>> = [[], [], []];
    // console.log(neighbors);
    // console.log("square on: ", squareOn);
    // console.log("number: " + this._notationToNumber(squareOn));

    for (let i = 0; i < neighbors.length; i++) {
      newNeighbors[i < 3 ? 0 : i > 4 ? 2 : 1].push(neighbors[i]);
    }

    // console.log(newNeighbors);
    // console.log(newMoveMap);

    if (piece.getName.toLowerCase() !== "n") {
      for (let i = 0; i < newMoveMap.length; i++) {
        for (let j = 0; j < newMoveMap.length; j++) {
          let details = newMoveMap[i][j];
          let squares = await this._getSquaresInDirection(
            piece.getSquare,
            newNeighbors[i][j],
            piece.getColor
          );
          if (!squares) {
            continue;
          }

          // squares.forEach((elem) => {
          //   console.log(elem.getNotation);
          // });

          if (details === "N") {
            continue;
          }
          //console.log("DETAILS: " + details);

          if (!details.includes(moveSquare)) {
            // CAPTURE ONLY: PAWN CAPTURE
            if (piece.getColor !== "white") {
              movableSquares.captureOnly.push(squares[0]);
            } else {
              movableSquares.captureOnly.push(squares[0]);
            }
            continue;
          }

          // CAN MOVE OR CAN MOVE AND CAPTURE
          if (details.includes(unlimitedSquares) && squares.length > 0) {
            squares.forEach((sq) => {
              movableSquares.moveAndCapture.push(sq);
            });
          }
          if (details.includes(oneSqaure) && squares.length > 0) {
            if (!details.includes(captureSquare)) {
              movableSquares.moveOnly.push(squares[0]);
            } else {
              movableSquares.moveAndCapture.push(squares[0]);
            }
          }
        }
      }
    }

    return movableSquares;
  }

  async _checkLegalMove(squareFrom: Square, squareTo: Square, debug?: boolean) {
    // Implement Legal Move Checking Here
    let result: boolean;

    if (debug) {
      console.log(squareFrom, squareTo);
    }
    if (
      this.turn === 0 &&
      squareFrom.getPiece.toLowerCase() === squareFrom.getPiece
    ) {
      return false;
    }

    if (
      this.turn === 1 &&
      squareFrom.getPiece.toUpperCase() === squareFrom.getPiece
    ) {
      return false;
    }

    if (squareTo.getPiece !== this.EMPTY) {
      if (
        !(squareTo.getPieceObj.getColor !== squareFrom.getPieceObj.getColor)
      ) {
        return false;
      }
    }

    // get piece moves
    let moves = await this._parseMoveMap(squareFrom.getPieceObj);

    if (!moves) {
      console.log("UNSUABLE RETURN! POSSIBLE ILLEGAL MOVE MADE");
      return true;
    }

    // CHECK FOR PAWN FIRST MOVE
    if (squareFrom.getPiece.toLowerCase() === "p") {
      let pawnMoveMade = squareFrom.getPieceObj.getFirstMoveMade;

      if (!pawnMoveMade) {
        let pawnSquare = moves.moveOnly[0].getNotation;
        let colorCoefficient =
          squareFrom.getPieceObj.getColor === "white" ? 1 : -1;
        let newNotation = parseInt(
          `${pawnSquare.charCodeAt(0)}${
            parseInt(pawnSquare.slice(-1)) + colorCoefficient
          }`
        );
        let newNotationSquare = this._notationToSquare(newNotation);
        if (newNotationSquare) {
          moves.moveOnly.push(newNotationSquare);
        }
      }
    }

    // CHECK IF SQUARE TO ME MOVED TO IS IN LEGAL MOVES

    if (moves.moveOnly.includes(squareTo)) {
      if (this._checkPawnFirstMove(squareFrom, squareTo)) {
        // DISABLE PAWN TWO MOVING PREVILEGES
        let pawn = squareFrom.getPieceObj;
        pawn.setFirstMoveMade();
      }
      result = true;
    } else if (moves.moveAndCapture.includes(squareTo)) {
      result = true;
    } else if (
      moves.captureOnly.includes(squareTo) &&
      this._checkCapture(squareFrom, squareTo)
    ) {
      result = true;
    } else {
      result = false;
    }

    return result;
  }

  _notationToSquare(notation: number) {
    let [row, col] = this._numberToIndices(notation);

    if (row > 7 || row < 0 || col > 7 || col < 0) {
      return;
    }

    let square: Square = this.board[row][col];

    return square;
  }

  _checkCapture(squareFrom: Square, squareTo: Square) {
    // returns if piece is bieng captured or not
    return (
      squareFrom.getPieceColor !== squareTo.getPieceColor &&
      squareTo.getPieceColor !== undefined
    );
  }

  async _getAllAttackedSquares(color: string) {
    let attackedSquares: Set<Square> = new Set<Square>();

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const square = this.board[i][j];

        if (square.getPiece === this.EMPTY) {
          continue;
        } else if (square.getPieceObj.getColor !== color) {
          continue;
        }
        const moves = await this._parseMoveMap(square.getPieceObj);
        const attackedSquaresForPiece = moves.captureOnly.concat(
          moves.moveAndCapture
        );

        attackedSquaresForPiece.forEach((sq) => {
          if (!sq) {
            return;
          }
          if (sq.getPiece === this.EMPTY || sq.getPieceObj.getColor !== color) {
            attackedSquares.add(sq);
          }
        });
      }
    }

    return attackedSquares;
  }

  async _updateCastleRights() {
    /* castling is only allowed if
        1. King and Rook in direction have not moved
        2. The squares that the king is castling to are not attacked
        3. Pieces in the way of the king and rook have been cleared
    */

    // TODO: if we permanently cannot castle in one direction then the temp variable for that direction is set to false
    this.canWhiteCastleKTemp = !this.canWhiteCastleKPerm ? false : true;
    this.canBlackCastleKTemp = !this.canBlackCastleKPerm ? false : true;

    this.canWhiteCastleQTemp = !this.canWhiteCastleQPerm ? false : true;
    this.canBlackCastleQTemp = !this.canBlackCastleQPerm ? false : true;

    const rookSquares = ["a1", "a8", "h1", "h8"];
    let pieceName = "";

    // doing a brute force search for moves because implementing anything else for <200 items is trivial
    for (let i = 0; i < this.moves.length; i++) {
      pieceName = this.moves[i].getPiece.getName.toLowerCase();
      if (pieceName !== "k" || pieceName !== "k") {
        continue;
      }

      const pieceColor = this.moves[i].getPieceColor;

      // if the king has moved then that side cannot castle anymore
      if (pieceName === "k") {
        if (pieceColor === "black") {
          this.canBlackCastleKPerm = false;
          this.canBlackCastleQPerm = false;
        } else {
          this.canWhiteCastleKPerm = false;
          this.canWhiteCastleQPerm = false;
        }
        continue;
      }

      // piece is rook
      const rookSquareFrom = this.moves[i].getSquareFrom.getNotation;
      const rookSquareIndex = rookSquares.indexOf(rookSquareFrom);

      // eliminate castling rights for side that rook moved
      if (rookSquareIndex > 2) {
        // eliminate queenside castling
        pieceColor === "white"
          ? (this.canWhiteCastleQPerm = false)
          : (this.canBlackCastleQPerm = false);
      } else {
        pieceColor === "white"
          ? (this.canWhiteCastleKPerm = false)
          : (this.canBlackCastleKPerm = false);
      }
    }

    // check if castling is clear
    const squaresNeededFree = ["g8", "g1", "f8", "f1", "d8", "d1", "c8", "c1"];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (!squaresNeededFree.includes(this.board[i][j].getNotation)) {
          continue;
        }

        switch (this.board[i][j].getNotation) {
          // _________________________________
          case "g8":

          case "f8": {
            this.canBlackCastleKTemp = false;
            break;
          }
          // _________________________________
          case "d8":

          case "c8": {
            this.canBlackCastleQTemp = false;
            break;
          }
          // _________________________________
          case "g1":

          case "f1": {
            this.canWhiteCastleKTemp = false;
            break;
          }
          // _________________________________
          case "d1":

          case "c1": {
            this.canWhiteCastleQTemp = false;
            break;
          }
        }
      }
    }

    // get attacked squares
    const attackedSquaresW = await this._getAllAttackedSquares("white");
    const attackedSquaresB = await this._getAllAttackedSquares("black");

    // check if squares in the way of castling are attacked
    attackedSquaresW.forEach((sq) => {
      if (sq.getNotation === "d8" || sq.getNotation === "c8") {
        this.canBlackCastleKTemp = false;
      } else if (sq.getNotation === "f8" || sq.getNotation === "g8") {
        this.canBlackCastleQTemp = false;
      }
    });

    attackedSquaresB.forEach((sq) => {
      if (sq.getNotation === "d1" || sq.getNotation === "c1") {
        this.canWhiteCastleKTemp = false;
      } else if (sq.getNotation === "f1" || sq.getNotation === "g1") {
        this.canWhiteCastleQTemp = false;
      }
    });
  }

  _canCastle(color: string, direction: string) {
    switch (direction) {
      case "K": {
        if (!this.canWhiteCastleKPerm) {
          return false;
        }
        break;
      }
      case "Q": {
        if (!this.canWhiteCastleQPerm) {
          return false;
        }
        break;
      }
      case "k": {
        if (!this.canBlackCastleKPerm) {
          return false;
        }
        break;
      }
      case "q": {
        if (!this.canBlackCastleQPerm) {
          return false;
        }
        break;
      }
    }
  }

  _checkPawnFirstMove(squareFrom: Square, squareTo: Square) {
    let sqFromNot = squareFrom.getNotation;
    let sqToNot = squareTo.getNotation;

    if (!sqFromNot || !sqToNot) {
      return;
    }

    let sqFromNum = this._notationToNumber(sqFromNot).toString();
    let sqToNum = this._notationToNumber(sqToNot).toString();

    let diffXSame =
      parseInt(sqFromNum.slice(0, -1)) === parseInt(sqToNum.slice(0, -1));

    let diffYApart = Math.abs(
      parseInt(sqFromNum.slice(-1)) - parseInt(sqToNum.slice(-1))
    );

    return diffXSame && diffYApart ? true : false;
  }

  async movePiece(
    notationFrom?: string,
    notationTo?: string,
    castleDirection?: string
  ) {
    if (!notationFrom || !notationTo) {
      return;
    }

    let flat = this._constructFlatBoard();
    let not1 = this._binarySearchNotation(flat, notationFrom);
    let not2 = this._binarySearchNotation(flat, notationTo);

    if (not1 !== -1 && not2 !== -1) {
      let fromSquare: Square = this._notationToSquare(not1)!;
      let toSquare: Square = this._notationToSquare(not2)!;

      console.log("FROM: " + fromSquare.getNotation);
      console.log("TO: " + toSquare.getNotation);

      let result = await this._checkLegalMove(fromSquare, toSquare);
      //let isCapture = this._checkCapture(fromSquare, toSquare);

      if (result) {
        if (this._checkCapture(fromSquare, toSquare)) {
          this.halfmoveClock = 0;
        } else if (fromSquare.getPieceObj.getName.toLowerCase() === "p") {
          this.halfmoveClock = 0;
        }

        let result = fromSquare.movePiece(toSquare);

        console.log("RES: " + result);

        if (result === -1) {
          console.log("INVALID PIECE!");
          return;
        }
        this.moves.push(
          new Move(toSquare.getPieceObj, notationFrom, notationTo)
        );
        if (this.turn === 0) {
          this.turn = 1;
        } else {
          this.turn = 0;
          this.fullMoveClock += 1;
          this.halfmoveClock += 1;
        }

        // update castling castling rights
        this._updateCastleRights();

        // check for en passant target square for FEN generation
        if (toSquare.getPiece.toLowerCase() === "p") {
          // get target square
          let colorConstant =
            toSquare.getPieceObj.getColor === "white" ? -1 : 1;
          let targetFile = parseInt(toSquare.getNotation[1]) + colorConstant;
          let targetSquare = `${toSquare.getNotation[0]}${targetFile}`;
          this._setBoardFEN(targetSquare);
        } else {
          this._setBoardFEN();
        }

        console.log("\n");
        console.log(this.printBoard());
      }
    }
  }

  printBoard(): string {
    let output = "";

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (!this.board[i][j]) {
          continue;
        }
        output += this.board[i][j].getAsciiPiece;
      }
      output += "\n";
    }
    return output;
  }
}

export default Board;
