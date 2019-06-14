import { PieceType } from "../../utils/piece";
import { DeepReadonly } from "utility-types";

export type BoardState = DeepReadonly<{
  pieces: IPieces;
  positions: {
    allPositions: Array<string>;
    allOccurTimes: Array<number>;
  };
  movesTo50Rule: number;
  pawnIdToChange: string;
  size: number;
  isGameOver: boolean;
  isWhiteMove: boolean;
}>;

export interface IPiecesById {
  [id: string]: IPieceData;
}

export interface IPieceData {
  col: number;
  row: number;
  isWhite: boolean;
  type: PieceType;
  everMoved?: boolean;
  canBeCaptured?: boolean;
  castled?: boolean;
  walkingOnWhite?: boolean;
}

interface IPieces {
  byId: IPiecesById;
  allIds: Array<string>;
}

export interface IMove {
  id: string;
  targetPosition: IPosition;
}

export interface IPosition {
  row: number;
  col: number;
}

export enum BoardActionTypes {
  INIT_SETUP = "@@board/INIT_SETUP",
  START = "@@board/START",
  TIMEOUT = "@@board/TIMEOUT",
  MOVE = "@@board/MOVE",
  MOVE_FAILED = "@@board/MOVE_FAILED",
  CHANGE_PAWN = "@@board/CHANGE_PAWN",
  CHANGE_PAWN_FAILED = "@@board/CHANGE_PAWN_FAILED",
  CHECK_MATE = "@@board/CHECK_MATE",
  DRAW = "@@board/DRAW",
  SET_SIZE = "@@board/SET_SIZE"
}

export interface IMovePayload {
  byId: IPiecesById;
  allIds: Array<string>;
  allPositions: Array<string>;
  allOccurTimes: Array<number>;
  movesTo50Rule: number;
  pawnIdToChange: string;
}

export interface ICheckMatePayload {
  byId: IPiecesById;
  allIds: Array<string>;
  isWhite: boolean;
}

export interface IDrawPayload {
  byId: IPiecesById;
  allIds: Array<string>;
}
