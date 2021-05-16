function getConsecutiveEmptySquares(fen: string, index: number): number {
  const emptyChar = fen[index];
  let length = 0;
  for (let i = index; i < fen.length; i++) {
    if (fen[i] === emptyChar) {
      length++;
    } else {
      break;
    }
  }

  return length;
}

export default getConsecutiveEmptySquares;
