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
  return (
    isStaleMate(byId, isKingChecked, isWhiteMove) ||
    !hasEnoughtMaterialToWin(byId)
  );
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

  for (let id in piecesWithColor) {
    const piece: IPieceData = piecesWithColor[id];
    const blockData: IBlock = { byId, id, piece, ownKing };
    if (!isPieceBlocked(blockData)) return false;
  }
  return true;
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

const hasEnoughtMaterialToWin = (byId: IPiecesById): boolean => {
  const pieces1 = [
    [PieceType.King],
    [PieceType.King, PieceType.Bishop],
    [PieceType.King, PieceType.Knight],
    [PieceType.King, PieceType.Bishop]
  ];
  const pieces2 = [
    [PieceType.King],
    [PieceType.King],
    [PieceType.King],
    [PieceType.King, PieceType.Bishop]
  ];

  const wPieces: IPiecesById = getPiecesWithColor(byId, true);
  const bPieces: IPiecesById = getPiecesWithColor(byId, false);

  const wPiecesLen: number = Object.keys(wPieces).length;
  const bPiecesLen: number = Object.keys(bPieces).length;

  for (let i = 0; i < pieces1.length; i++) {
    const p1 = pieces1[i];
    const p2 = pieces2[i];

    if (p1.length === wPiecesLen && p2.length === bPiecesLen) {
      if (!canPlayWithCombination(byId, i, p1, p2, wPieces, bPieces))
        return false;
    } else if (p1.length === bPiecesLen && p2.length === wPiecesLen) {
      if (!canPlayWithCombination(byId, i, p2, p1, wPieces, bPieces))
        return false;
    }
  }

  return true;
};

const canPlayWithCombination = (
  byId: IPiecesById,
  loopIndex: number,
  pieces1: Array<PieceType>,
  pieces2: Array<PieceType>,
  piecesColor1: IPiecesById,
  piecesColor2: IPiecesById
): boolean => {
  let isWhiteOk: boolean = true;
  let isBlackOk: boolean = true;
  let bishopsAreDifferent: boolean = false;
  let isBishopWhite: boolean = false;

  for (let id in piecesColor1) {
    const pieceType = byId[id].type;
    if (pieces1.indexOf(pieceType) === -1) isWhiteOk = false;
    if (loopIndex === 3 && pieceType === PieceType.Bishop) {
      isBishopWhite = byId[id].walkingOnWhite as boolean;
    }
  }

  for (let id in piecesColor2) {
    const pieceType = byId[id].type;
    if (pieces2.indexOf(pieceType) === -1) isBlackOk = false;
    if (loopIndex === 3 && pieceType === PieceType.Bishop) {
      bishopsAreDifferent =
        (byId[id].walkingOnWhite as boolean) !== isBishopWhite;
    }
  }

  return !(isWhiteOk && isBlackOk && !bishopsAreDifferent);
};
