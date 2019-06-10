import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { PieceType } from "../piece";
import { isPawnMoveValid } from "./pawn";
import { isKnightMoveValid } from "./knight";
import { isBishopMoveValid } from "./bishop";
import { isRookMoveValid } from "./rook";
import { isKingMoveValid } from "./king";

export const isFieldAttacked = (
  piecesById: IPiecesById,
  pos: IPosition,
  byWhite: boolean
): boolean => {
  const pieceOnFieldID = getPieceId(pos, piecesById);
  const pieceOnField: IPieceData | null = pieceOnFieldID
    ? piecesById[pieceOnFieldID]
    : null;

  const attackingPieces: IPiecesById = getPiecesWithColor(piecesById, byWhite);
  for (let id in attackingPieces) {
    const moveData: IMove = { id, position: pos };
    const pieceData: IPieceData = attackingPieces[id];

    if (
      !tryingToMakeForbiddenMove(moveData, pieceData, pieceOnField, piecesById)
    ) {
      return true;
    }
  }
  return false;
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
  if (tryingToMoveToTheSamePlace(moveData, movedPiece)) return false;
  if (tryingToMakeForbiddenMove(moveData, movedPiece, targetPiece, piecesById))
    return false;
  return true;
};

const tryingToMoveOutsideBoard = ({ col, row }: IPosition): boolean => {
  return col < 0 || col > 7 || row < 0 || row > 7;
};

const tryingToMoveToTheSamePlace = (
  moveData: IMove,
  movedPiece: IPieceData
): boolean => {
  return (
    moveData.position.row === movedPiece.row &&
    moveData.position.col === movedPiece.col
  );
};

const tryingToMoveOnOwnPiece = (
  movedPiece: IPieceData,
  targetPiece: IPieceData | null
) => {
  if (!targetPiece) return false;
  return movedPiece.isWhite === targetPiece.isWhite;
};

export const tryingToMakeForbiddenMove = (
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  piecesById: IPiecesById
): boolean => {
  switch (movedPiece.type) {
    case PieceType.Pawn:
      return !isPawnMoveValid(moveData, movedPiece, targetPiece, piecesById);
    case PieceType.Knight:
      return !isKnightMoveValid(moveData, movedPiece);
    case PieceType.Bishop:
      return !isBishopMoveValid(moveData, movedPiece, piecesById);
    case PieceType.Rook:
      return !isRookMoveValid(moveData, movedPiece, piecesById);
    case PieceType.Queen:
      return (
        !isBishopMoveValid(moveData, movedPiece, piecesById) &&
        !isRookMoveValid(moveData, movedPiece, piecesById)
      );
    case PieceType.King:
      return !isKingMoveValid(moveData, movedPiece);
    default:
      throw Error("Wrong piece type");
  }
};

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

export const getPiecesWithColor = (
  byId: IPiecesById,
  white: boolean
): IPiecesById => {
  const piecesWithColor: IPiecesById = {};
  for (let id in byId) {
    if (byId[id].isWhite === white) piecesWithColor[id] = { ...byId[id] };
  }

  return piecesWithColor;
};
