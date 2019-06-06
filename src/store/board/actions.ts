import { action } from "typesafe-actions";
import store from "../index";
import { BoardActionTypes, IPiecesById, IMove } from "./types";
import { getInitPieceArray, filterByIdObj } from "../../utils/piece";
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
  const { id, targetCol, targetRow } = moveData;
  const { byId, allIds } = store.getState().board.pieces;

  let newById: IPiecesById = deepCopy<IPiecesById>(byId);
  let newAllIds: Array<string> = [...allIds];

  newById[id].col = targetCol;
  newById[id].row = targetRow;

  const shouldRemoveAnyPiece = allIds.length !== newAllIds.length;
  if (shouldRemoveAnyPiece) {
    const deepByIdCopy: IPiecesById = deepCopy<IPiecesById>(newById);
    newById = filterByIdObj(deepByIdCopy, newAllIds);
  }

  const payload = {
    byId: newById,
    allIds: newAllIds
  };

  return action(BoardActionTypes.MOVE, payload);
};
