import {
  IMove,
  IPieceData,
  IPosition,
  IPiecesById
} from "../../store/board/types";
import { IBlock } from "./draw";
import { getPieceId, isFieldAttacked, tryingToMoveOutsideBoard } from "./index";
import { deepCopy } from "../objects";

export const isKnightMoveValid = (
  moveData: IMove,
  movedPiece: IPieceData
): boolean => {
  const colDistance = Math.abs(moveData.position.col - movedPiece.col);
  const rowDistance = Math.abs(moveData.position.row - movedPiece.row);
  return (
    (colDistance === 1 && rowDistance === 2) ||
    (colDistance === 2 && rowDistance === 1)
  );
};

export const isKnightBlocked = (data: IBlock): boolean => {
  return isKingChekedAfterMove(data) || !isAnyMovePossible(data);
};

const isKingChekedAfterMove = (data: IBlock): boolean => {
  const { byId, id, ownKing } = data;
  const kingPos: IPosition = { col: ownKing.col, row: ownKing.row };
  const byIdCopy: IPiecesById = deepCopy(byId);
  delete byIdCopy[id];
  return isFieldAttacked(byIdCopy, kingPos, !ownKing.isWhite);
};

const isAnyMovePossible = (data: IBlock): boolean => {
  const colMoves: Array<number> = [-2, -1, 1, 2];
  for (let c = 0; c < colMoves.length; c++) {
    const colMove = colMoves[c];
    const rowMoves: Array<number> = getRowMoves(colMove);
    for (let r = 0; r < rowMoves.length; r++) {
      const rowMove = rowMoves[r];
      const moveVector: IPosition = { col: colMove, row: rowMove };
      if (isMovePossible(data, moveVector)) return true;
    }
  }
  return false;
};

const getRowMoves = (colMove: number): Array<number> => {
  const rowMoves: Array<number> =
    Math.abs(colMove) === 1
      ? [colMove * 2, colMove * -2]
      : [colMove / 2, colMove / -2];
  return rowMoves;
};

const isMovePossible = (data: IBlock, moveVector: IPosition): boolean => {
  const { byId, piece } = data;
  const { col, row, isWhite } = piece;
  const targetPos = { col: col + moveVector.col, row: row + moveVector.row };
  if (!tryingToMoveOutsideBoard(targetPos)) {
    const pieceOnTargetPos: string | null = getPieceId(targetPos, byId);
    if (pieceOnTargetPos) {
      if (byId[pieceOnTargetPos].isWhite === isWhite) return false;
    } else return true;
  }
  return false;
};
