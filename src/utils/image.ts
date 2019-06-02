import { PieceType } from "./piece";
import whiteRook from "../assets/images/w_rook.png";
import whiteKnight from "../assets/images/w_knight.png";
import whiteBishop from "../assets/images/w_bishop.png";
import whiteQueen from "../assets/images/w_queen.png";
import whiteKing from "../assets/images/w_king.png";
import whitePawn from "../assets/images/w_pawn.png";
import blackRook from "../assets/images/b_rook.png";
import blackKnight from "../assets/images/b_knight.png";
import blackBishop from "../assets/images/b_bishop.png";
import blackQueen from "../assets/images/b_queen.png";
import blackKing from "../assets/images/b_king.png";
import blackPawn from "../assets/images/b_pawn.png";

export const getImage = (piece: PieceType, isWhite: boolean): string => {
  if (isWhite) {
    switch (piece) {
      case PieceType.Bishop:
        return whiteBishop;
      case PieceType.King:
        return whiteKing;
      case PieceType.Knight:
        return whiteKnight;
      case PieceType.Pawn:
        return whitePawn;
      case PieceType.Queen:
        return whiteQueen;
      case PieceType.Rook:
        return whiteRook;
      default:
        return whitePawn;
    }
  }
  switch (piece) {
    case PieceType.Bishop:
      return blackBishop;
    case PieceType.King:
      return blackKing;
    case PieceType.Knight:
      return blackKnight;
    case PieceType.Pawn:
      return blackPawn;
    case PieceType.Queen:
      return blackQueen;
    case PieceType.Rook:
      return blackRook;
    default:
      return whitePawn;
  }
};
