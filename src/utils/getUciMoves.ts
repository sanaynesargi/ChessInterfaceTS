import Move from "../moves/move";

export async function getUciMoves(moves: Array<Move>) {
  let outStr = "";

  moves.forEach((move) => {
    outStr += move.print() + " ";
  });

  return outStr;
}
