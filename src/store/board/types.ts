import { PieceType } from "../../utils/piece";

export interface IBoardState {
  pieces: IPieces;
}

interface IPieces {
  byId: IPiecesById;
  allIds: Array<string>;
}

export interface IPiecesById {
  [id: string]: IPieceData;
}

export interface IPieceData {
  col: number;
  row: number;
  isWhite: boolean;
  type: PieceType;
}

interface IResetBoardAction {
  type: string;
  payload: IPieces;
}

interface IMoveAction {
  type: string;
  payload: IPieces;
}

export interface IMove {
  id: string;
  targetRow: number;
  targetCol: number;
}

export type BoardActionTypes = IResetBoardAction | IMoveAction;
