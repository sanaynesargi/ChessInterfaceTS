import Board from "./board";

import fs from "fs";
import Move from "./move";

interface dictionary {
  key: string;
  value: number;
}

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

function validateFEN(fen: string) {
  const valuesW = ["P", "N", "K", "R", "Q", "K"];
  const valuesB = ["p", "n", "k", "r", "q", "k"];

  if (fen.split("/").length !== 8) {
    return false;
  }

  for (const f of fen) {
    if (Number.isInteger(parseInt(f)) || f === "/") {
      continue;
    }

    if (!valuesW.includes(f) && !valuesB.includes(f)) {
      return false;
    }
  }

  return true;
}

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function buildObject(dictionary: Array<dictionary>) {
  const obj = { fens: {} };

  for (let i = 0; i < dictionary.length; i++) {
    const key = dictionary[i].key;
    const value = dictionary[i].value;
    obj.fens[key] = value;
  }

  return obj;
}

async function getUciMoves(moves: Array<Move>) {
  let outStr = "";

  moves.forEach((move) => {
    outStr += move.print() + " ";
  });

  return outStr;
}

async function getResults(fPath: string) {
  const rawData = fs.readFileSync(fPath).toString();
  const data: dictionary = JSON.parse(rawData).fens;
  const storedMoves = [];
  let c = 0;

  for (const [key] of Object.entries(data)) {
    if (validateFEN(key)) {
      const board = new Board();
      board.setBoard(key);
      const legalMoves = await board.getLegalMoves("white");
      const legalMovesParsed = await getUciMoves(legalMoves);
      storedMoves.push({
        key: key,
        value: legalMovesParsed,
      });
    }
    c += 1;
    console.log("IT: " + c);
    await sleep(4000);
  }

  const testData = buildObject(storedMoves);
  const fileTestData = JSON.stringify(testData);
  fs.writeFileSync("./TEST_SOLUTION.json", fileTestData);
}

async function main() {
  let board = new Board();

  board.setBoard();

  // const legalMovesInPosition = await (
  //   await board.getLegalMoves("white")
  // ).sort();
  // let outStr = "";

  // legalMovesInPosition.forEach((move) => {
  //   outStr +=
  //     move.print() +
  //     (legalMovesInPosition.indexOf(move) % 6 === 0 ? "\n" : " ");
  // });
  //console.log(outStr);

  console.log(board.printBoard());

  getResults("FENS.json");

  printMoves(board);
}

main();
