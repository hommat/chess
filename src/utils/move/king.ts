import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { getPieceId, isFieldAttacked, tryingToMoveOutsideBoard } from "./index";
import { IBlock } from "./draw";
import { deepCopy } from "../objects";

interface ICastlingOutput {
  isValid: boolean;
  kingPos: IPosition;
  rookId: string;
  rookPos: IPosition;
}

export const isKingMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData
): boolean => {
  const { col, row } = movedPiece;
  const colDistance = moveData.position.col - col;
  const rowDistance = moveData.position.row - row;
  if (Math.abs(colDistance) > 1 || Math.abs(rowDistance) > 1) return false;

  return true;
};

export const castling = (
  king: IPieceData,
  moveData: IMove,
  piecesById: IPiecesById
): ICastlingOutput => {
  const output: ICastlingOutput = {
    isValid: false,
    kingPos: { col: -1, row: -1 },
    rookId: "-1",
    rookPos: { col: -1, row: -1 }
  };
  const { col, row, everMoved, isWhite, castled } = king;
  if (everMoved || castled) return output;

  const colDistance = moveData.position.col - col;
  const rowDistance = moveData.position.row - row;
  if (rowDistance !== 0 || Math.abs(colDistance) !== 2) return output;

  const rookRow = isWhite ? 0 : 7;
  const rookCol = colDistance === 2 ? 7 : 0;
  const rookId: string | null = getPieceId(
    { col: rookCol, row: rookRow },
    piecesById
  );

  if (!rookId) return output;
  output.rookId = rookId;

  const rook: IPieceData = piecesById[rookId];
  if (rook.everMoved) return output;

  const goingRight = colDistance > 0;
  let checkedPositions = 0;
  while (checkedPositions < Math.abs(colDistance) + (goingRight ? 0 : 1)) {
    const colToCheck = col + (checkedPositions + 1) * (goingRight ? 1 : -1);
    const idAtCheckedPos = getPieceId({ col: colToCheck, row }, piecesById);
    if (idAtCheckedPos) return output;
    if (isFieldAttacked(piecesById, { col: colToCheck, row }, !isWhite))
      return output;
    checkedPositions++;
  }

  output.kingPos = { row, col: col + (goingRight ? 2 : -2) };
  output.rookPos = { row, col: rook.col + (goingRight ? -2 : 3) };
  output.isValid = true;

  return output;
};

export const isKingBlocked = (data: IBlock): boolean => {
  const { byId, piece } = data;
  const { col, row, isWhite } = piece;

  for (let c: number = -1; c <= 1; c++) {
    for (let r: number = -1; r <= 1; r++) {
      if (r === 0 && c === 0) continue;

      const targetPos: IPosition = { col: col + c, row: row + r };
      if (!tryingToMoveOutsideBoard(targetPos)) {
        const idOnTargetPos: string | null = getPieceId(targetPos, byId);
        if (idOnTargetPos) {
          if (byId[idOnTargetPos].isWhite !== isWhite) {
            if (!isKingGonnaBeCheck(data, targetPos)) {
              console.log("can move ", targetPos);
              return false;
            }
          }
        } else if (!isKingGonnaBeCheck(data, targetPos)) {
          console.log("can move ", targetPos);
          return false;
        }
      }
    }
  }
  return true;
};

export const isKingGonnaBeCheck = (
  data: IBlock,
  targetPos: IPosition
): boolean => {
  const { byId, id, piece } = data;
  const { isWhite } = piece;
  const byIdCopy: IPiecesById = deepCopy(byId);

  byIdCopy[id].col = targetPos.col;
  byIdCopy[id].row = targetPos.row;

  return isFieldAttacked(byIdCopy, byIdCopy[id], !isWhite);
};
