import Board from "./board";

async function scholarsMate(board: Board) {
  await board.movePiece("e2", "e4");
  await board.movePiece("e7", "e5");
  await board.movePiece("d1", "h5");
  await board.movePiece("d8", "h4");
  await board.movePiece("f1", "c4");
  await board.movePiece("g8", "f6");
  await board.movePiece("h5", "f7");
}

function printMoves(board: Board) {
  board.getPlayedMoves.forEach((elem) => {
    console.log(
      `${elem.getPiece.getName} MOVED TO ${elem.getSquareTo} FROM ${elem.getSquareFrom}`
    );
  });
}

async function main() {
  let board = new Board();

  board.setBoard();

  console.log(board.printBoard());

  let legalMoves = await board.getLegalMoves("white");

  console.log(legalMoves.length);

  legalMoves.forEach((move) => {
    console.log(
      `${move.getPiece.getName} TO: ${move.getSquareTo.getNotation} FROM: ${move.getSquareFrom.getNotation}`
    );
  });

  printMoves(board);
}

main();
