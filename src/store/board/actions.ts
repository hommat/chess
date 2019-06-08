import { action } from "typesafe-actions";
import store from "../index";
import { BoardActionTypes, IPiecesById, IMove, IPieceData } from "./types";
import { isMoveValid, getPieceId } from "../../utils/move";
import {
  getCapturingInPassData,
  unableCaptureForColor
} from "../../utils/move/pawn";
import { getInitPieceArray, filterByIdObj, PieceType } from "../../utils/piece";
import { deepCopy } from "../../utils/objects";

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

  //CAPTURE IN PASS
  if (movedPiece.type === PieceType.Pawn) {
    const CIPData: string | null = getCapturingInPassData(
      movedPiece,
      moveData,
      targetPiece,
      newById
    );
    if (CIPData) {
      const deepByIdCopy: IPiecesById = deepCopy<IPiecesById>(newById);
      newAllIds = newAllIds.filter(id => id !== CIPData);
      newById = filterByIdObj(deepByIdCopy, newAllIds);
      newById[id].col = position.col;
      newById[id].row = position.row;
      const payload = {
        byId: newById,
        allIds: newAllIds
      };
      unableCaptureForColor(!movedPiece.isWhite, newById);
      return action(BoardActionTypes.CAPTURE_IN_PASSING, payload);
    }
  }

  if (!isMoveValid(moveData, movedPiece, targetPiece, newById)) {
    return action(BoardActionTypes.MOVE_FAILED);
  }

  if (
    movedPiece.type === PieceType.Pawn &&
    Math.abs(movedPiece.row - position.row)
  )
    newById[id].canBeCaptured = true;
  newById[id].col = position.col;
  newById[id].row = position.row;

  if (targetPiece) newAllIds = newAllIds.filter(id => id !== targetId);
  const shouldRemoveAnyPiece = allIds.length !== newAllIds.length;
  if (shouldRemoveAnyPiece) newById = filterByIdObj(newById, newAllIds);

  const payload = {
    byId: newById,
    allIds: newAllIds
  };

  unableCaptureForColor(!movedPiece.isWhite, newById);
  return action(BoardActionTypes.MOVE, payload);
};
