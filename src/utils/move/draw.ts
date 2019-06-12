import { IPiecesById, IPieceData } from "../../store/board/types";
import { PieceType } from "../piece";
import { getPiecesWithColor } from "./index";
import { isPawnBlocked } from "./pawn";
import { isKnightBlocked } from "./knight";
import { isBishopBlocked } from "./bishop";
import { isRookBlocked } from "./rook";
import { isKingBlocked } from "./king";

export interface IBlock {
  byId: IPiecesById;
  piece: IPieceData;
  id: string;
  ownKing: IPieceData;
}

export const isDraw = (
  byId: IPiecesById,
  isKingChecked: boolean,
  isWhiteMove: boolean
): boolean => {
  return isStaleMate(byId, isKingChecked, isWhiteMove);
};

const isStaleMate = (
  byId: IPiecesById,
  isKingChecked: boolean,
  isWhiteMove: boolean
): boolean => {
  return !isKingChecked && isEveryPieceBlocked(byId, !isWhiteMove);
};

const isEveryPieceBlocked = (byId: IPiecesById, isWhite: boolean): boolean => {
  const piecesWithColor: IPiecesById = getPiecesWithColor(byId, isWhite);
  const ownKingId: string = isWhite ? "4" : "20";
  const ownKing: IPieceData = byId[ownKingId];

  //POTEM ZMIENIC ZEBY TYLKO SPRTAWDZALO W LOOPIE
  let isBlocked = true;

  for (let id in piecesWithColor) {
    const piece: IPieceData = piecesWithColor[id];
    const blockData: IBlock = { byId, id, piece, ownKing };
    // if (!isPieceBlocked(blockData)) return false;

    if (!isPieceBlocked(blockData)) isBlocked = false;
    else {
      if (piece.type === 5) {
        console.log(
          `${piece.isWhite ? "White" : "Black"} piece blocked occurer: `
        );
        console.log(piece);
      }
    }
  }
  return isBlocked;
};

const isPieceBlocked = (blockData: IBlock): boolean => {
  switch (blockData.piece.type) {
    case PieceType.Pawn:
      return isPawnBlocked(blockData);
    case PieceType.Knight:
      return isKnightBlocked(blockData);
    case PieceType.Bishop:
      return isBishopBlocked(blockData);
    case PieceType.Rook:
      return isRookBlocked(blockData);
    case PieceType.Queen:
      return isBishopBlocked(blockData) && isRookBlocked(blockData);
    case PieceType.King:
      return isKingBlocked(blockData);
    default:
      throw Error("Wrong piece type");
  }
};
