function flattenRank(rank: Array<any>): string {
  let newRank: string = "";

  rank.forEach((sq) => {
    newRank += sq.getPiece;
  });

  return newRank;
}

export default flattenRank;
