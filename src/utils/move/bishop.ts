import { IMove, IPieceData, IPiecesById } from "../../store/board/types";
import { getPieceId } from "./index";

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
