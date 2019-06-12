import { action } from "typesafe-actions";
import store from "../index";
import {
  BoardActionTypes,
  IPiecesById,
  IMove,
  IPieceData,
  IPosition
} from "./types";
import { isMoveValid, getPieceId, isFieldAttacked } from "../../utils/move";
import { isCheckMate } from "../../utils/move/checkmate";
import { isDraw } from "../../utils/move/draw";
import {
  getCaptureInPassData,
  unableCaptureForColor
} from "../../utils/move/pawn";
import { castling } from "../../utils/move/king";
import { getInitPieceArray, filterByIdObj, PieceType } from "../../utils/piece";
import { deepCopy } from "../../utils/objects";

type DestroyId = string | null;

export const setSize = (size: number) => {
  return action(BoardActionTypes.SET_SIZE, size);
};

export const resetBoard = () => {
  const newById: IPiecesById = getInitPieceArray();
  const newAllIds: Array<string> = [];

  for (let property in newById) {
    newAllIds.push(property);
  }
  const payload = {
    byId: newById,
    allIds: newAllIds
  };

  return action(BoardActionTypes.RESET, payload);
};

export const move = (moveData: IMove) => {
  console.log("--------------");
  const { id, position } = moveData;
  const { pieces, isWhiteMove, isGameOver } = store.getState().board;
  const { byId, allIds } = pieces;
  let newById: IPiecesById = deepCopy<IPiecesById>(byId);
  let newAllIds: Array<string> = [...allIds];

  const movedPiece: IPieceData = byId[id];
  const targetId: string | null = getPieceId(moveData.position, newById);
  const targetPiece: IPieceData | null = targetId ? newById[targetId] : null;
  const { type, row, isWhite } = movedPiece;

  if (isGameOver || isWhiteMove !== isWhite) {
    return action(BoardActionTypes.MOVE_FAILED);
  }

  const ownKing: IPieceData = newById[isWhite ? "4" : "20"];
  const enemyKing: IPieceData = newById[isWhite ? "20" : "4"];
  //CASTLING
  if (type === PieceType.King && !targetPiece) {
    const { isValid, kingPos, rookPos, rookId } = castling(
      movedPiece,
      moveData,
      newById
    );
    if (isValid) {
      newById[id].col = kingPos.col;
      newById[id].castled = true;
      newById[id].everMoved = true;
      newById[rookId].col = rookPos.col;
      newById[rookId].everMoved = true;

      const ownKingPos: IPosition = { row: ownKing.row, col: ownKing.col };
      if (isFieldAttacked(newById, ownKingPos, !isWhite)) {
        return action(BoardActionTypes.MOVE_FAILED);
      }

      const payload = {
        byId: newById,
        allIds: newAllIds
      };

      const enemyKingPos: IPosition = {
        row: enemyKing.row,
        col: enemyKing.col
      };
      const isEnemyKingChecked = isFieldAttacked(
        newById,
        enemyKingPos,
        isWhite
      );
      if (isEnemyKingChecked) {
        if (isCheckMate(newById, enemyKingPos, isWhite)) {
          return action(BoardActionTypes.CHECK_MATE, { ...payload, isWhite });
        }
      }

      if (isDraw(newById, isEnemyKingChecked, isWhiteMove)) {
        return action(BoardActionTypes.DRAW, payload);
      }

      unableCaptureForColor(!movedPiece.isWhite, newById);
      return action(BoardActionTypes.MOVE, payload);
    }
  }

  //CAPTURE IN PASS
  if (type === PieceType.Pawn && !targetPiece) {
    const dID: DestroyId = getCaptureInPassData(movedPiece, moveData, newById);
    if (dID) {
      const deepByIdCopy: IPiecesById = deepCopy<IPiecesById>(newById);
      newAllIds = newAllIds.filter(id => id !== dID);
      newById = filterByIdObj(deepByIdCopy, newAllIds);
      newById[id].col = position.col;
      newById[id].row = position.row;

      const ownKingPos: IPosition = { row: ownKing.row, col: ownKing.col };
      if (isFieldAttacked(newById, ownKingPos, !isWhite)) {
        return action(BoardActionTypes.MOVE_FAILED);
      }

      const payload = {
        byId: newById,
        allIds: newAllIds
      };

      const enemyKingPos: IPosition = {
        row: enemyKing.row,
        col: enemyKing.col
      };
      const isEnemyKingChecked = isFieldAttacked(
        newById,
        enemyKingPos,
        isWhite
      );
      if (isEnemyKingChecked) {
        if (isCheckMate(newById, enemyKingPos, isWhite)) {
          return action(BoardActionTypes.CHECK_MATE, { ...payload, isWhite });
        }
      }

      if (isDraw(newById, isEnemyKingChecked, isWhiteMove)) {
        return action(BoardActionTypes.DRAW, payload);
      }

      unableCaptureForColor(!movedPiece.isWhite, newById);
      return action(BoardActionTypes.MOVE, payload);
    }
  }

  if (!isMoveValid(moveData, movedPiece, targetPiece, newById)) {
    return action(BoardActionTypes.MOVE_FAILED);
  }

  if (type === PieceType.Pawn && Math.abs(row - position.row) === 2) {
    newById[id].canBeCaptured = true;
  }
  if (type === PieceType.Rook || type === PieceType.King) {
    newById[id].everMoved = true;
  }
  newById[id].col = position.col;
  newById[id].row = position.row;

  if (targetPiece) newAllIds = newAllIds.filter(id => id !== targetId);
  const shouldRemoveAnyPiece = allIds.length !== newAllIds.length;
  if (shouldRemoveAnyPiece) newById = filterByIdObj(newById, newAllIds);

  const ownKingPos: IPosition = { row: ownKing.row, col: ownKing.col };
  const enemyKingPos: IPosition = { row: enemyKing.row, col: enemyKing.col };
  if (isFieldAttacked(newById, ownKingPos, !isWhite)) {
    return action(BoardActionTypes.MOVE_FAILED);
  }

  const payload = {
    byId: newById,
    allIds: newAllIds
  };

  const isEnemyKingChecked = isFieldAttacked(newById, enemyKingPos, isWhite);

  if (isEnemyKingChecked) {
    if (isCheckMate(newById, enemyKingPos, isWhite)) {
      return action(BoardActionTypes.CHECK_MATE, { ...payload, isWhite });
    }
  }

  if (isDraw(newById, isEnemyKingChecked, isWhiteMove)) {
    return action(BoardActionTypes.DRAW, payload);
  }

  unableCaptureForColor(!movedPiece.isWhite, newById);
  return action(BoardActionTypes.MOVE, payload);
};
