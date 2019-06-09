import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import { getPieceId, isFieldAttacked } from "./index";

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
