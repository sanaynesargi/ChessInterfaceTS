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

async function main() {
  let board = new Board();

  board
    .setBoard
    // "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2"
    ();

  await scholarsMate(board);

  console.log(board.printBoard());

  board.getPlayedMoves.forEach((elem) => {
    console.log(
      `${elem.getPiece.getName} MOVED TO ${elem.getSquareTo} FROM ${elem.getSquareFrom}`
    );
  });
}

main();
