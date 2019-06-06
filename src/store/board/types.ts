import { PieceType } from "../../utils/piece";
import { DeepReadonly } from "utility-types";

export type BoardState = DeepReadonly<{
  pieces: IPieces;
  size: number;
}>;

export interface IPiecesById {
  [id: string]: IPieceData;
}

export interface IPieceData {
  col: number;
  row: number;
  isWhite: boolean;
  type: PieceType;
}

interface IPieces {
  byId: IPiecesById;
  allIds: Array<string>;
}

export interface IMove {
  id: string;
  targetRow: number;
  targetCol: number;
}

export enum BoardActionTypes {
  RESET = "@@board/BOARD",
  MOVE = "@@board/MOVE",
  SET_SIZE = "@@board/SET_SIZE"
}
