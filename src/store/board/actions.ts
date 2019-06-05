import store from "../index";
import { BoardActionTypes, IPiecesById, IMove } from "./types";
import Constants from "./constants";
import { getInitPieceArray, filterByIdObj } from "../../utils/piece";
import { deepCopy } from "../../utils/objects";

export const resetBoard = (): BoardActionTypes => {
  const newById: IPiecesById = getInitPieceArray();
  const newAllIds: Array<string> = [];

  for (let property in newById) {
    newAllIds.push(property);
  }

  return {
    type: Constants.RESET_BOARD,
    payload: {
      byId: newById,
      allIds: newAllIds
    }
  };
};

export const move = (moveData: IMove): BoardActionTypes => {
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

  return {
    type: Constants.MOVE,
    payload: {
      byId: newById,
      allIds: newAllIds
    }
  };
};
