import Board from "../board";

export function printMoves(board: Board) {
  board.getPlayedMoves.forEach((elem) => {
    console.log(
      `${elem.getPiece.getName} MOVED TO ${elem.getSquareTo} FROM ${elem.getSquareFrom}`
    );
  });
}
