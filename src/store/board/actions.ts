import { action, Action } from "typesafe-actions";
import store from "../index";
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
import {
  BoardActionTypes,
  IPiecesById,
  IMove,
  IPieceData,
  IPosition,
  IDrawPayload,
  IMovePayload,
  ICheckMatePayload
} from "./types";

type DestroyId = string | null;

export const setSize = (size: number) => {
  return action(BoardActionTypes.SET_SIZE, size);
};

export const initSetup = () => {
  const payload = getInitSetupPayload();
  return action(BoardActionTypes.INIT_SETUP, payload);
};

export const startGame = () => {
  const payload = getInitSetupPayload();
  return action(BoardActionTypes.START, payload);
};

const getInitSetupPayload = (): {
  byId: IPiecesById;
  allIds: Array<string>;
} => {
  const newById: IPiecesById = getInitPieceArray();
  const newAllIds: Array<string> = [];

  for (let property in newById) {
    newAllIds.push(property);
  }
  return {
    byId: newById,
    allIds: newAllIds
  };
};

export const move = (moveData: IMove) => {
  const { id, targetPosition } = moveData;
  const {
    pieces,
    isWhiteMove,
    isGameOver,
    pawnIdToChange
  } = store.getState().board;
  const { byId, allIds } = pieces;
  const newById: IPiecesById = deepCopy<IPiecesById>(byId);
  const newAllIds: Array<string> = [...allIds];

  const movedPiece: IPieceData = byId[id];
  const targetId: string | null = getPieceId(targetPosition, newById);
  const targetPiece: IPieceData | null = targetId ? newById[targetId] : null;

  if (
    isGameOver ||
    isWhiteMove !== movedPiece.isWhite ||
    pawnIdToChange !== "-1"
  )
    return action(BoardActionTypes.MOVE_FAILED);

  //CASTLING
  if (movedPiece.type === PieceType.King && !targetPiece) {
    const { isValid, ...rest } = castling(movedPiece, moveData, newById);
    if (isValid) {
      const { kingPos, rookId, rookPos } = rest;
      return castlingAction(newById, newAllIds, id, kingPos, rookId, rookPos);
    }
  }

  //CAPTURE IN PASS
  if (movedPiece.type === PieceType.Pawn && !targetPiece) {
    const dID: DestroyId = getCaptureInPassData(movedPiece, moveData, newById);
    if (dID)
      return captureInPassAction(newById, newAllIds, id, targetPosition, dID);
  }

  //NORMAL MOVE
  return normalMoveAction(
    newById,
    newAllIds,
    moveData,
    movedPiece,
    targetPiece,
    targetId
  );
};

const castlingAction = (
  newById: IPiecesById,
  newAllIds: Array<string>,
  kingId: string,
  newKingPos: IPosition,
  rookId: string,
  newRookPos: IPosition
): Action => {
  newById[kingId].col = newKingPos.col;
  newById[kingId].castled = true;
  newById[kingId].everMoved = true;
  newById[rookId].col = newRookPos.col;
  newById[rookId].everMoved = true;

  return calculateAndGetAction(newById, newAllIds, false, "-1");
};

const captureInPassAction = (
  newById: IPiecesById,
  allIds: Array<string>,
  movingPawnId: string,
  newPawnPosition: IPosition,
  pawnToDestroyId: string
): Action => {
  const deepByIdCopy: IPiecesById = deepCopy<IPiecesById>(newById);
  const newAllIds = allIds.filter(id => id !== pawnToDestroyId);
  newById = filterByIdObj(deepByIdCopy, newAllIds);
  newById[movingPawnId].col = newPawnPosition.col;
  newById[movingPawnId].row = newPawnPosition.row;

  return calculateAndGetAction(newById, newAllIds, true, "-1");
};

const normalMoveAction = (
  newById: IPiecesById,
  allIds: Array<string>,
  moveData: IMove,
  movedPiece: IPieceData,
  targetPiece: IPieceData | null,
  targetId: string | null
): Action => {
  if (!isMoveValid(moveData, movedPiece, targetPiece, newById))
    return action(BoardActionTypes.MOVE_FAILED);

  const { type, row, isWhite } = movedPiece;
  const { id, targetPosition } = moveData;
  let newAllIds: Array<string> = [...allIds];

  if (type === PieceType.Pawn && Math.abs(row - targetPosition.row) === 2) {
    newById[id].canBeCaptured = true;
  }
  if (type === PieceType.Rook || type === PieceType.King) {
    newById[id].everMoved = true;
  }
  newById[id].col = targetPosition.col;
  newById[id].row = targetPosition.row;

  if (targetPiece) {
    newAllIds = newAllIds.filter(aid => aid !== targetId);
    newById = filterByIdObj(newById, newAllIds);
  }

  const pawnOnLastField: boolean =
    type === PieceType.Pawn && newById[id].row === (isWhite ? 7 : 0);
  const newPawnIdToChange: string = pawnOnLastField ? id : "-1";

  return calculateAndGetAction(
    newById,
    newAllIds,
    targetPiece !== null || type === PieceType.Pawn,
    newPawnIdToChange
  );
};

export const changePawn = (newType: PieceType) => {
  const { pieces, pawnIdToChange } = store.getState().board;
  const { byId, allIds } = pieces;

  const newById: IPiecesById = deepCopy<IPiecesById>(byId);

  if (newType === PieceType.King || newType === PieceType.Pawn)
    return action(BoardActionTypes.CHANGE_PAWN_FAILED);

  const pawnToChange: IPieceData = newById[pawnIdToChange];
  pawnToChange.type = newType;

  const calcdAction = calculateAndGetAction(newById, [...allIds], true, "-1");
  if (calcdAction.type !== BoardActionTypes.MOVE) return calcdAction;
  else return action(BoardActionTypes.CHANGE_PAWN, { byId: newById });
};

const calculateAndGetAction = (
  newById: IPiecesById,
  newAllIds: Array<string>,
  reset50rule: boolean,
  pawnIdToChange: string
): Action => {
  const {
    isWhiteMove,
    positions,
    pieces,
    movesTo50Rule
  } = store.getState().board;
  const { allPositions, allOccurTimes } = positions;

  const anyPieceDestroyed: boolean = newAllIds.length !== pieces.allIds.length;
  const newMovesTo50Rule: number = reset50rule ? 0 : movesTo50Rule + 1;

  const ownKing: IPieceData = newById[isWhiteMove ? "4" : "20"];
  const ownKingPos: IPosition = { col: ownKing.col, row: ownKing.row };
  const enemyKing: IPieceData = newById[isWhiteMove ? "20" : "4"];
  const enemyKingPos: IPosition = { col: enemyKing.col, row: enemyKing.row };

  if (isFieldAttacked(newById, ownKingPos, !isWhiteMove))
    return action(BoardActionTypes.MOVE_FAILED);

  const [newAllPostions, newAllOccurTimes] = getPositionsData(
    newById,
    [...allPositions],
    [...allOccurTimes]
  );

  const isEnemyKingChecked: boolean = isFieldAttacked(
    newById,
    enemyKingPos,
    isWhiteMove
  );

  const checkMate =
    isEnemyKingChecked && isCheckMate(newById, enemyKingPos, isWhiteMove);

  if (checkMate) {
    const payload: ICheckMatePayload = {
      byId: newById,
      allIds: newAllIds,
      isWhite: isWhiteMove
    };
    return action(BoardActionTypes.CHECK_MATE, payload);
  }

  const draw = isDraw(
    newById,
    isEnemyKingChecked,
    isWhiteMove,
    anyPieceDestroyed,
    newAllOccurTimes,
    newMovesTo50Rule
  );

  if (draw) {
    const payload: IDrawPayload = { byId: newById, allIds: newAllIds };
    return action(BoardActionTypes.DRAW, payload);
  }

  const payload: IMovePayload = {
    byId: newById,
    allIds: newAllIds,
    allPositions: newAllPostions,
    allOccurTimes: newAllOccurTimes,
    movesTo50Rule: newMovesTo50Rule,
    pawnIdToChange: pawnIdToChange
  };

  unableCaptureForColor(!isWhiteMove, newById);
  return action(BoardActionTypes.MOVE, payload);
};

const getPositionsData = (
  actualPosition: IPiecesById,
  positions: Array<string>,
  occurTimes: Array<number>
): [Array<string>, Array<number>] => {
  const newAllPostions: Array<string> = [...positions];
  const newAllOccurTimes: Array<number> = [...occurTimes];
  const boardPositon: string = JSON.stringify(actualPosition);
  const posIndex: number = newAllPostions.indexOf(boardPositon);
  if (posIndex === -1) {
    newAllPostions.push(boardPositon);
    newAllOccurTimes.push(0);
  } else newAllOccurTimes[posIndex] += 1;
  return [newAllPostions, newAllOccurTimes];
};
