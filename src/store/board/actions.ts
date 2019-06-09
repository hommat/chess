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
  const { id, position } = moveData;
  const { byId, allIds } = store.getState().board.pieces;
  let newById: IPiecesById = deepCopy<IPiecesById>(byId);
  let newAllIds: Array<string> = [...allIds];

  const movedPiece: IPieceData = byId[id];
  const targetId: string | null = getPieceId(moveData.position, newById);
  const targetPiece: IPieceData | null = targetId ? newById[targetId] : null;
  const { type, row, isWhite } = movedPiece;

  const ownKing: IPieceData = newById[isWhite ? "4" : "20"];
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
  if (isFieldAttacked(newById, ownKingPos, !isWhite)) {
    return action(BoardActionTypes.MOVE_FAILED);
  }

  const payload = {
    byId: newById,
    allIds: newAllIds
  };

  unableCaptureForColor(!movedPiece.isWhite, newById);
  return action(BoardActionTypes.MOVE, payload);
};
