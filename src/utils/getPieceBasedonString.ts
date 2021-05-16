import { PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, EMPTY } from "../constants";
import Piece from "../piece";
import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Queen from "../pieces/queen";
import Rook from "../pieces/rook";

function getCorrectPiece(
  piece: string,
  color: string,
  notation: string
): Piece | string {
  let newPiece: string = piece.toUpperCase();
  let returnedPiece: string | Piece = "";

  if (newPiece === PAWN) {
    returnedPiece = new Pawn(notation, color);
  }
  if (newPiece === KNIGHT) {
    returnedPiece = new Knight(notation, color);
  }
  if (newPiece === BISHOP) {
    returnedPiece = new Bishop(notation, color);
  }
  if (newPiece === ROOK) {
    returnedPiece = new Rook(notation, color);
  }
  if (newPiece === QUEEN) {
    returnedPiece = new Queen(notation, color);
  }
  if (newPiece === KING) {
    returnedPiece = new King(notation, color);
  }
  if (typeof returnedPiece === "string") {
    returnedPiece = EMPTY;
  }

  return returnedPiece;
}

export default getCorrectPiece;
