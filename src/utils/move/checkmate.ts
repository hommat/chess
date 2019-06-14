import {
  IMove,
  IPieceData,
  IPiecesById,
  IPosition
} from "../../store/board/types";
import {
  getPieceId,
  getPiecesWithColor,
  tryingToMakeForbiddenMove,
  isFieldAttacked
} from "./index";
import { deepCopy } from "../objects";
import { PieceType } from "../piece";

export const isCheckMate = (
  byId: IPiecesById,
  kingPos: IPosition,
  byWhite: boolean
): boolean => {
  const attPieces: string[] = getPiecesAttackingField(byId, kingPos, byWhite);
  const defencePieces: IPiecesById = getPiecesWithColor(byId, !byWhite);

  return (
    !canAnyoneCover(attPieces, byId, kingPos, defencePieces, byWhite) &&
    !canKingEscapeAnywhere(byId, kingPos, byWhite) &&
    !canAnyoneDestoroyAttackingPiece(attPieces, byId, defencePieces, byWhite)
  );
};

const getPiecesAttackingField = (
  piecesById: IPiecesById,
  pos: IPosition,
  byWhite: boolean
): Array<string> => {
  const piecesAttackingField = [];
  const pieceOnFieldID = getPieceId(pos, piecesById);
  const pieceOnField: IPieceData | null = pieceOnFieldID
    ? piecesById[pieceOnFieldID]
    : null;

  const attackingPieces: IPiecesById = getPiecesWithColor(piecesById, byWhite);
  for (let id in attackingPieces) {
    const moveData: IMove = { id, targetPosition: pos };
    const pieceData: IPieceData = attackingPieces[id];

    if (canMove(moveData, pieceData, pieceOnField, piecesById)) {
      piecesAttackingField.push(id);
    }
  }
  return piecesAttackingField;
};

const canAnyoneCover = (
  attackingPieces: Array<string>,
  piecesById: IPiecesById,
  kingPos: IPosition,
  piecesToDefend: IPiecesById,
  byWhite: boolean
): boolean => {
  if (attackingPieces.length === 1) {
    const attackingPieceId: string = attackingPieces[0];
    const attackingPiece: IPieceData = piecesById[attackingPieceId];
    if (canPiecesAttackBeCovered(attackingPiece)) {
      const colDistance: number = attackingPiece.col - kingPos.col;
      const rowDistance: number = attackingPiece.row - kingPos.row;

      if (!hasPlaceToCover(rowDistance, colDistance)) return false;

      const piecesToDefendWithoutKing: IPiecesById = deepCopy(piecesToDefend);
      const ownKingId = byWhite ? "20" : "4";
      delete piecesToDefendWithoutKing[ownKingId];

      if (isAttackStraight(attackingPiece, kingPos)) {
        const isHoriznotal: boolean = Math.abs(colDistance) > 1;
        const { startLoop, endLoop } = getStraigtLoopData(
          isHoriznotal,
          attackingPiece,
          kingPos
        );

        for (let defendId in piecesToDefendWithoutKing) {
          const defendingPiece: IPieceData = piecesById[defendId];
          for (let i = startLoop; i <= endLoop; i++) {
            const moveData: IMove = getStraightCoverMoveData(
              defendId,
              isHoriznotal,
              attackingPiece,
              i
            );

            if (canMove(moveData, defendingPiece, null, piecesById)) {
              const byIdCopy: IPiecesById = deepCopy(piecesById);
              byIdCopy[defendId].col = isHoriznotal ? i : attackingPiece.col;
              byIdCopy[defendId].row = isHoriznotal ? attackingPiece.row : i;
              if (!isFieldAttacked(byIdCopy, kingPos, byWhite)) {
                console.log("tym moze sie zaslonic");
                console.log(defendingPiece);
                return true;
              }
            }
          }
        }
      } else {
        const { iterations, addCols, addRows } = getDiagonalLoopData(
          attackingPiece,
          kingPos
        );

        for (let defendId in piecesToDefendWithoutKing) {
          const defendingPiece: IPieceData = piecesById[defendId];
          for (let i = 1; i <= iterations; i++) {
            const moveData: IMove = getDiagonalCoverMoveData(
              defendId,
              attackingPiece,
              i,
              addCols,
              addRows
            );

            if (canMove(moveData, defendingPiece, null, piecesById)) {
              const byIdCopy: IPiecesById = deepCopy(piecesById);
              byIdCopy[defendId].col = moveData.targetPosition.col;
              byIdCopy[defendId].row = moveData.targetPosition.row;
              if (!isFieldAttacked(byIdCopy, kingPos, byWhite)) {
                console.log("tym moze sie zaslonic");
                console.log(defendingPiece);
                return true;
              }
            }
          }
        }
      }
    }
  }
  return false;
};

const canPiecesAttackBeCovered = (attackingPiece: IPieceData): boolean => {
  return (
    attackingPiece.type === PieceType.Rook ||
    attackingPiece.type === PieceType.Bishop ||
    attackingPiece.type === PieceType.Queen
  );
};

const isAttackStraight = (
  attackingPiece: IPieceData,
  kingPos: IPosition
): boolean => {
  return (
    attackingPiece.type === PieceType.Rook ||
    (attackingPiece.type === PieceType.Queen &&
      (attackingPiece.row === kingPos.row ||
        attackingPiece.col === kingPos.col))
  );
};

const hasPlaceToCover = (rowDistance: number, colDistance: number): boolean => {
  return Math.abs(colDistance) > 1 || Math.abs(rowDistance) > 1;
};

const getStraigtLoopData = (
  horizontal: boolean,
  attackingPiece: IPieceData,
  kingPos: IPosition
): { startLoop: number; endLoop: number } => {
  const data = { startLoop: 0, endLoop: 0 };
  data.startLoop = horizontal
    ? Math.min(attackingPiece.col, kingPos.col) + 1
    : Math.min(attackingPiece.row, kingPos.row) + 1;

  data.endLoop = horizontal
    ? Math.max(attackingPiece.col, kingPos.col) - 1
    : Math.max(attackingPiece.row, kingPos.row) - 1;

  return data;
};

const getDiagonalLoopData = (
  attackingPiece: IPieceData,
  kingPos: IPosition
): {
  iterations: number;
  addRows: boolean;
  addCols: boolean;
} => {
  const data = { iterations: 0, addRows: false, addCols: false };
  data.iterations = Math.abs(attackingPiece.col - kingPos.col) - 1;
  data.addCols = attackingPiece.col < kingPos.col;
  data.addRows = attackingPiece.row < kingPos.row;

  return data;
};

const getStraightCoverMoveData = (
  id: string,
  isHorizontal: boolean,
  attackingPiece: IPieceData,
  i: number
): IMove => {
  const moveData: IMove = {
    id: id,
    targetPosition: {
      col: isHorizontal ? i : attackingPiece.col,
      row: isHorizontal ? attackingPiece.row : i
    }
  };
  return moveData;
};

const getDiagonalCoverMoveData = (
  id: string,
  attackingPiece: IPieceData,
  amount: number,
  addCols: boolean,
  addRows: boolean
): IMove => {
  const moveData: IMove = {
    id: id,
    targetPosition: {
      col: attackingPiece.col + amount * (addCols ? 1 : -1),
      row: attackingPiece.row + amount * (addRows ? 1 : -1)
    }
  };
  return moveData;
};

const canAnyoneDestoroyAttackingPiece = (
  attackingPieces: Array<string>,
  piecesById: IPiecesById,
  piecesToDefend: IPiecesById,
  byWhite: boolean
): boolean => {
  if (attackingPieces.length === 1) {
    const pieceToDestroyId: string = attackingPieces[0];
    const pieceToDestroy: IPieceData = piecesById[pieceToDestroyId];
    const targetPos = { col: pieceToDestroy.col, row: pieceToDestroy.row };

    for (let defendId in piecesToDefend) {
      const moveData: IMove = { id: defendId, targetPosition: targetPos };
      const defendingPiece: IPieceData = piecesById[defendId];

      if (canMove(moveData, defendingPiece, pieceToDestroy, piecesById)) {
        const byIdCopy: IPiecesById = deepCopy(piecesById);
        delete byIdCopy[pieceToDestroyId];
        byIdCopy[defendId].col = targetPos.col;
        byIdCopy[defendId].row = targetPos.row;

        const ownKingId = byWhite ? "20" : "4";
        const king: IPieceData = byIdCopy[ownKingId];
        const newKingPos: IPosition = { col: king.col, row: king.row };
        if (!isFieldAttacked(byIdCopy, newKingPos, byWhite)) {
          console.log("tym moze zbic atakujacego pionka");
          console.log(defendingPiece);
          return true;
        }
      }
      if (canPieceBeCaptured(pieceToDestroy, defendingPiece)) {
        console.log("moze zbic poprzez bicie w przelocie");
        return true;
      }
    }
  }
  return false;
};

const canPieceBeCaptured = (
  pieceToDestroy: IPieceData,
  defendingPiece: IPieceData
): boolean => {
  return (
    pieceToDestroy.type === PieceType.Pawn &&
    defendingPiece.type === PieceType.Pawn &&
    (pieceToDestroy.canBeCaptured as boolean) &&
    Math.abs(defendingPiece.col - pieceToDestroy.col) === 1 &&
    defendingPiece.row === pieceToDestroy.row
  );
};

const canKingEscapeAnywhere = (
  piecesById: IPiecesById,
  kingPos: IPosition,
  byWhite: boolean
): boolean => {
  for (let colToAdd = -1; colToAdd <= 1; colToAdd++) {
    for (let rowToAdd = -1; rowToAdd <= 1; rowToAdd++) {
      if (colToAdd === 0 && rowToAdd === 0) continue;
      const colToCheck = kingPos.col + colToAdd;
      const rowToCheck = kingPos.row + rowToAdd;
      if (isPositionOutBoard(colToCheck, rowToCheck)) continue;

      const byIdCopy: IPiecesById = deepCopy(piecesById);
      const newPosition: IPosition = { col: colToCheck, row: rowToCheck };
      const pieceIdAtPosition = getPieceId(newPosition, piecesById);
      if (pieceIdAtPosition) {
        if (piecesById[pieceIdAtPosition].isWhite === !byWhite) continue;
        else delete byIdCopy[pieceIdAtPosition];
      }
      const ownKingId = byWhite ? "20" : "4";
      byIdCopy[ownKingId].col = newPosition.col;
      byIdCopy[ownKingId].row = newPosition.row;

      if (!isFieldAttacked(byIdCopy, newPosition, byWhite)) {
        console.log("krol moze sie tu ruszyc");
        console.log(newPosition);
        return true;
      }
    }
  }
  return false;
};

export const isPositionOutBoard = (col: number, row: number): boolean => {
  return col < 0 || col > 7 || row < 0 || row > 7;
};

export const canMove = (
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  piecesById: IPiecesById
): boolean =>
  !tryingToMakeForbiddenMove(moveData, movedPiece, targetPiece, piecesById);

export const isStaleMate = (): boolean => {
  return false;
};
