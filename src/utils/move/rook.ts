import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { IBlock } from "./draw";
import { getPieceId, tryingToMoveOutsideBoard, isFieldAttacked } from "./index";
import { deepCopy } from "../objects";

export const isRookMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData,
  piecesById: IPiecesById
): boolean => {
  const { col, row } = movedPiece;
  const colDistance = moveData.targetPosition.col - col;
  const rowDistance = moveData.targetPosition.row - row;
  if (Math.abs(colDistance) !== 0 && Math.abs(rowDistance) !== 0) return false;

  const goingHorizontal = colDistance !== 0;
  const goingPositive = goingHorizontal ? colDistance > 0 : rowDistance > 0;

  let checkedPositions = 0;
  const fieldsToCheck =
    Math.abs(goingHorizontal ? colDistance : rowDistance) - 1;

  while (checkedPositions < fieldsToCheck) {
    let idAtCheckedPos: string | null = null;

    if (goingHorizontal) {
      const colCheck = col + (checkedPositions + 1) * (goingPositive ? 1 : -1);
      idAtCheckedPos = getPieceId({ col: colCheck, row }, piecesById);
    } else {
      const rowCheck = row + (checkedPositions + 1) * (goingPositive ? 1 : -1);
      idAtCheckedPos = getPieceId({ col, row: rowCheck }, piecesById);
    }

    if (idAtCheckedPos) return false;
    checkedPositions++;
  }

  return true;
};

export const isRookBlocked = (data: IBlock): boolean => {
  const { ownKing } = data;
  const kingPos: IPosition = { col: ownKing.col, row: ownKing.row };

  const isBlockedHor = isRookBlockedOnDirection(data, kingPos, true);
  const isBlockedVert = isRookBlockedOnDirection(data, kingPos, false);

  return isBlockedHor && isBlockedVert;
};

const isRookBlockedOnDirection = (
  data: IBlock,
  kingPos: IPosition,
  horizontal: boolean
): boolean => {
  const { piece, byId } = data;
  const { row, col, isWhite } = piece;
  for (let i: number = -1; i <= 1; i += 2) {
    const targetPos: IPosition = {
      col: col + (horizontal ? i : 0),
      row: row + (horizontal ? 0 : i)
    };
    if (!tryingToMoveOutsideBoard(targetPos)) {
      const idOnTargetPos: string | null = getPieceId(targetPos, byId);
      if (idOnTargetPos) {
        if (byId[idOnTargetPos].isWhite !== isWhite) {
          if (!isKingGonnaBeCheck(data, targetPos, kingPos)) return false;
        }
      } else if (!isKingGonnaBeCheck(data, targetPos, kingPos)) return false;
    }
  }
  return true;
};

const isKingGonnaBeCheck = (
  data: IBlock,
  targetPos: IPosition,
  kingPos: IPosition
): boolean => {
  const { byId, id, piece } = data;
  const { isWhite } = piece;
  const byIdCopy: IPiecesById = deepCopy(byId);

  byIdCopy[id].col = targetPos.col;
  byIdCopy[id].row = targetPos.row;

  return isFieldAttacked(byIdCopy, kingPos, !isWhite);
};
