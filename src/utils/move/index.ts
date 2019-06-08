import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { PieceType } from "../piece";
import { isPawnMoveValid } from "./pawn";

export const getPieceId = (
  position: IPosition,
  byId: IPiecesById
): string | null => {
  const { col, row } = position;
  for (let id in byId) {
    if (byId[id].col === col && byId[id].row === row) {
      return id;
    }
  }
  return null;
};

export const isMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  piecesById: IPiecesById
): boolean => {
  const { col, row } = moveData.position;

  if (tryingToMoveOutsideBoard({ col, row })) return false;
  if (tryingToMoveOnOwnPiece(movedPiece, targetPiece)) return false;
  if (tryingToMakeForbiddenMove(moveData, movedPiece, targetPiece, piecesById))
    return false;
  if (willBeCheckedAfterMove()) return false;
  return true;
};

const tryingToMoveOutsideBoard = ({ col, row }: IPosition): boolean => {
  return col < 0 || col > 7 || row < 0 || row > 7;
};

const tryingToMoveOnOwnPiece = (
  movedPiece: IPieceData,
  targetPiece: IPieceData | null
) => {
  if (!targetPiece) return false;
  return movedPiece.isWhite === targetPiece.isWhite;
};

const tryingToMakeForbiddenMove = (
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  piecesById: IPiecesById
): boolean => {
  switch (movedPiece.type) {
    case PieceType.Pawn:
      return !isPawnMoveValid(moveData, movedPiece, targetPiece, piecesById);
    case PieceType.Knight:
      return false;
    case PieceType.Bishop:
      return false;
    case PieceType.Rook:
      return false;
    case PieceType.Queen:
      return false;
    case PieceType.King:
      return false;
    default:
      return true;
  }
};

const willBeCheckedAfterMove = (): boolean => false;
