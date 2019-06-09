import { IMove, IPieceData } from "../../store/board/types";

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
