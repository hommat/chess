import { getPieceId, isFieldAttacked } from "./index";
import { PieceType } from "../piece";
import { IBlock } from "./draw";
import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { deepCopy } from "../objects";

export const getCaptureInPassData = (
  movedPiece: IPieceData,
  moveData: IMove,
  piecesById: IPiecesById
): string | null => {
  const { row, col, isWhite } = movedPiece;

  const ownRequiredRow = isWhite ? 4 : 3;
  if (row !== ownRequiredRow) return null;

  const rowDistance = moveData.targetPosition.row - row;
  const colDistance = moveData.targetPosition.col - col;
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
  const rowDistance = moveData.targetPosition.row - row;
  const colDistance = moveData.targetPosition.col - col;
  const distance = { row: rowDistance, col: colDistance };

  if (!movedColumnProper(distance, targetPiece)) return false;
  if (Math.abs(colDistance) > 1) return false;
  if (!movedForward(isWhite, rowDistance)) return false;
  if (Math.abs(rowDistance) > 2) return false;
  if (Math.abs(rowDistance) === 2) {
    if (!movedTwoRowsProper(movedPiece, piecesById)) return false;
  }
  if (Math.abs(colDistance) === 0 && targetPiece) return false;
  return true;
};

const movedColumnProper = (
  distance: IPosition,
  targetPiece: IPieceData | null
): boolean => {
  const { row, col } = distance;
  if (Math.abs(col) > 1) return false;
  if (Math.abs(col) === 1 && Math.abs(row) !== 1) return false;
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

export const isPawnBlocked = (data: IBlock): boolean => {
  return !canGoForward(data) && !canCapturePiece(data);
};

const canGoForward = (data: IBlock): boolean => {
  const { byId, piece, ownKing, id } = data;
  const { col, row, isWhite } = piece;

  const targetRow = row + (isWhite ? 1 : -1);
  const forwardPiecePos: IPosition = { col, row: targetRow };
  const forwardPieceId: string | null = getPieceId(forwardPiecePos, byId);
  if (!forwardPieceId) {
    const byIdCopy: IPiecesById = deepCopy(byId);
    byIdCopy[id].row = targetRow;
    const ownKingPos: IPosition = { col: ownKing.col, row: ownKing.row };
    if (!isFieldAttacked(byIdCopy, ownKingPos, !isWhite)) {
      return true;
    }
  }

  return false;
};

const canCapturePiece = (data: IBlock): boolean => {
  const { byId, piece, ownKing, id } = data;
  const { col, row, isWhite } = piece;

  const targetRow = row + (isWhite ? 1 : -1);
  const targetCols: Array<number> = [col - 1, col + 1];
  const ownKingPos: IPosition = { col: ownKing.col, row: ownKing.row };

  for (let i = 0; i < targetCols.length; i++) {
    const pieceToCapturePos: IPosition = { col: targetCols[i], row: targetRow };
    const pieceToCaptureId: string | null = getPieceId(pieceToCapturePos, byId);
    if (pieceToCaptureId) {
      if (byId[pieceToCaptureId].isWhite !== isWhite) {
        const byIdCopy: IPiecesById = deepCopy(byId);

        delete byIdCopy[pieceToCaptureId];
        byIdCopy[id].row = targetRow;
        byIdCopy[id].col = targetCols[i];

        if (!isFieldAttacked(byIdCopy, ownKingPos, !isWhite)) {
          return true;
        }
      }
    }
  }

  //Capture in pass
  for (let i = 0; i < targetCols.length; i++) {
    const pieceToCapturePos: IPosition = { col: targetCols[i], row };
    const pieceToCaptureId: string | null = getPieceId(pieceToCapturePos, byId);
    if (pieceToCaptureId) {
      const pieceToCapture: IPieceData = byId[pieceToCaptureId];
      if (pieceToCapture.canBeCaptured && pieceToCapture.isWhite !== isWhite) {
        const byIdCopy: IPiecesById = deepCopy(byId);

        delete byIdCopy[pieceToCaptureId];
        byIdCopy[id].row = row + (isWhite ? 1 : -1);
        byIdCopy[id].col = targetCols[i];

        if (!isFieldAttacked(byIdCopy, ownKingPos, !isWhite)) {
          return true;
        }
      }
    }
  }

  return false;
};
