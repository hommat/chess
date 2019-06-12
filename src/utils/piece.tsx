import React from "react";
import { IPiecesById } from "../store/board/types";
import Piece from "../components/chess/pieces/Piece";

export enum PieceType {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King
}

export interface IPiece {
  id: string;
  type: PieceType;
  col: number;
  row: number;
  isWhite: boolean;
  everMoved?: boolean;
  movedTwo?: boolean;
  castled?: boolean;
}

export const getJSXPieceArray = (
  piecesById: IPiecesById
): Array<JSX.Element> => {
  return byIdToPieceArray(piecesById).map(getJSXPiece);
};

const getJSXPiece = (props: IPiece): JSX.Element => {
  const propsObj = { key: props.id, id: props.id };
  return <Piece {...propsObj} />;
};

export const getInitPieceArray = (): IPiecesById => {
  const piecesById: IPiecesById = {};

  for (let i = 0; i < 2; i++) {
    const baseId: number = i * 16;
    const baseRow: number = i * 7;
    const pawnRow: number = baseRow === 0 ? 1 : 6;
    const startPawnLoop: number = baseId + 8;
    const endPawnLoop: number = baseId + 16;
    const isWhite: boolean = i === 0;

    piecesById[baseId.toString()] = {
      type: PieceType.Rook,
      col: 0,
      row: baseRow,
      isWhite: isWhite,
      everMoved: false
    };
    piecesById[(baseId + 1).toString()] = {
      type: PieceType.Knight,
      col: 1,
      row: baseRow,
      isWhite: isWhite
    };
    piecesById[(baseId + 2).toString()] = {
      type: PieceType.Bishop,
      col: 2,
      row: baseRow,
      isWhite: isWhite,
      walkingOnWhite: i === 1
    };
    piecesById[(baseId + 3).toString()] = {
      type: PieceType.Queen,
      col: 3,
      row: baseRow,
      isWhite: isWhite
    };
    piecesById[(baseId + 4).toString()] = {
      type: PieceType.King,
      col: 4,
      row: baseRow,
      isWhite: isWhite,
      everMoved: false,
      castled: false
    };
    piecesById[(baseId + 5).toString()] = {
      type: PieceType.Bishop,
      col: 5,
      row: baseRow,
      isWhite: isWhite,
      walkingOnWhite: i === 0
    };
    piecesById[(baseId + 6).toString()] = {
      type: PieceType.Knight,
      col: 6,
      row: baseRow,
      isWhite: isWhite
    };
    piecesById[(baseId + 7).toString()] = {
      type: PieceType.Rook,
      col: 7,
      row: baseRow,
      isWhite: isWhite,
      everMoved: false
    };
    for (let j = startPawnLoop; j < endPawnLoop; j++) {
      piecesById[j.toString()] = {
        type: PieceType.Pawn,
        col: j - startPawnLoop,
        row: pawnRow,
        isWhite: isWhite,
        canBeCaptured: false
      };
    }
  }
  return piecesById;
};

const byIdToPieceArray = (piecesById: IPiecesById): Array<IPiece> => {
  const pieceArray: Array<IPiece> = [];
  for (let proprerty in piecesById) {
    pieceArray.push({ id: proprerty, ...piecesById[proprerty] });
  }
  return pieceArray;
};

export const filterByIdObj = (
  piecesById: IPiecesById,
  allIds: Array<string>
): IPiecesById => {
  const piecesObjIds = Object.getOwnPropertyNames(piecesById);
  const idsToRemove = piecesObjIds.filter(id => allIds.indexOf(id) === -1);
  idsToRemove.forEach(id => delete piecesById[id]);
  return piecesById;
};
