import Board from "./board";

async function main() {
  let board = new Board();

  board.setBoard();

  await board.movePiece("e2", "e4");
}

main();
