import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { getPieceId, tryingToMoveOutsideBoard, isFieldAttacked } from "./index";
import { deepCopy } from "../objects";
import { IBlock } from "./draw";

export const isBishopMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData,
  piecesById: IPiecesById
): boolean => {
  const { col, row } = movedPiece;
  const colDistance = moveData.position.col - col;
  const rowDistance = moveData.position.row - row;
  if (Math.abs(colDistance) !== Math.abs(rowDistance)) return false;

  const goingRight = colDistance > 0;
  const goingTop = rowDistance > 0;
  let checkedPositions = 0;
  while (checkedPositions < Math.abs(colDistance) - 1) {
    const colToCheck = col + (checkedPositions + 1) * (goingRight ? 1 : -1);
    const rowToCheck = row + (checkedPositions + 1) * (goingTop ? 1 : -1);
    const idAtCheckedPos = getPieceId(
      { col: colToCheck, row: rowToCheck },
      piecesById
    );
    if (idAtCheckedPos) return false;
    checkedPositions++;
  }

  return true;
};

export const isBishopBlocked = (data: IBlock): boolean => {
  const { ownKing, byId, piece } = data;
  const { col, row, isWhite } = piece;
  const kingPos: IPosition = { col: ownKing.col, row: ownKing.row };
  for (let c: number = -1; c <= 1; c += 2) {
    for (let r: number = -1; r <= 1; r += 2) {
      const targetPos: IPosition = { col: col + c, row: row + r };
      if (!tryingToMoveOutsideBoard(targetPos)) {
        const idOnTargetPos: string | null = getPieceId(targetPos, byId);
        if (idOnTargetPos) {
          if (byId[idOnTargetPos].isWhite !== isWhite) {
            if (!isKingGonnaBeCheck(data, targetPos, kingPos)) return false;
          }
        } else if (!isKingGonnaBeCheck(data, targetPos, kingPos)) return false;
      }
    }
  }
  return true;
};

export const isKingGonnaBeCheck = (
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
