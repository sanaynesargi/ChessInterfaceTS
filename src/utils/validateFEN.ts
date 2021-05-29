export function validateFEN(fen: string) {
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
