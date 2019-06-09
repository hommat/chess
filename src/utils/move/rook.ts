import { IMove, IPieceData, IPiecesById } from "../../store/board/types";
import { getPieceId } from "./index";

export const isRookMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData,
  piecesById: IPiecesById
): boolean => {
  const { col, row } = movedPiece;
  const colDistance = moveData.position.col - col;
  const rowDistance = moveData.position.row - row;
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
