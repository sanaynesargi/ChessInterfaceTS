import Board from "../board";
import fs from "fs";
import { validateFEN } from "./validateFEN";
import { sleep } from "./sleep";
import { buildObject } from "./buildObject";
import { getUciMoves } from "./getUciMoves";
import { dictionary } from "./dictionary";

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
