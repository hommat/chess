import { getPieceId } from "./index";
import { PieceType } from "../piece";

import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";

export const getCaptureInPassData = (
  movedPiece: IPieceData,
  moveData: IMove,
  piecesById: IPiecesById
): string | null => {
  const { row, col, isWhite } = movedPiece;

  const ownRequiredRow = isWhite ? 4 : 3;
  if (row !== ownRequiredRow) return null;

  const rowDistance = moveData.position.row - row;
  const colDistance = moveData.position.col - col;
  if (Math.abs(colDistance) !== 1 || Math.abs(rowDistance) !== 1) return null;

  const colToCheck = col + colDistance;
  const idToDestroy = getPieceId(
    { row: ownRequiredRow, col: colToCheck },
    piecesById
  );
  if (idToDestroy) {
    const pieceToDestroy = piecesById[idToDestroy];
    if (pieceToDestroy.type === PieceType.Pawn && pieceToDestroy.canBeCaptured)
      return idToDestroy;
  }

  return null;
};

export const unableCaptureForColor = (
  isWhite: boolean,
  byId: IPiecesById
): void => {
  for (let id in byId) {
    if (byId[id].isWhite === isWhite && byId[id].type === PieceType.Pawn) {
      byId[id].canBeCaptured = false;
    }
  }
};

export const isPawnMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  piecesById: IPiecesById
): boolean => {
  const { row, col, isWhite } = movedPiece;
  const rowDistance = moveData.position.row - row;
  const colDistance = moveData.position.col - col;
  const distance = { row: rowDistance, col: colDistance };

  if (!movedColumnProper(distance, targetPiece)) return false;
  if (Math.abs(colDistance) > 1) return false;
  if (!movedForward(isWhite, rowDistance)) return false;
  if (Math.abs(rowDistance) > 2) return false;
  if (Math.abs(rowDistance) === 2) {
    if (!movedTwoRowsProper(movedPiece, piecesById)) return false;
  }
  return true;
};

const movedColumnProper = (
  distance: IPosition,
  targetPiece: IPieceData | null
): boolean => {
  const { row, col } = distance;
  if (Math.abs(col) > 1) return false;
  if (Math.abs(col) === 1 && Math.abs(row) !== 1) return false;
  if (!targetPiece && Math.abs(col) === 1) {
  }
  if (!targetPiece && col !== 0) return false;

  return true;
};

const movedForward = (isWhite: boolean, rowDistance: number): boolean => {
  if (isWhite && rowDistance <= 0) return false;
  else if (!isWhite && rowDistance >= 0) return false;
  return true;
};

const movedTwoRowsProper = (
  movedPiece: IPieceData,
  piecesById: IPiecesById
): boolean => {
  const { col, row, isWhite } = movedPiece;
  if (isWhite) {
    if (row !== 1) return false;
    if (getPieceId({ row: row + 1, col }, piecesById)) {
      return false;
    }
    if (getPieceId({ row: row + 2, col }, piecesById)) {
      return false;
    }
  } else {
    if (row !== 6) return false;
    if (getPieceId({ row: row - 1, col }, piecesById)) {
      return false;
    }
    if (getPieceId({ row: row - 2, col }, piecesById)) {
      return false;
    }
  }
  return true;
};
