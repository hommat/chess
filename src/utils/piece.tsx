import React from "react";
import { IPiecesById } from "../store/board/types";
import Bishop from "../components/chess/pieces/Bishop";
// import King from "../components/chess/pieces/King";
// import Knight from "../components/chess/pieces/Knight";
// import Pawn from "../components/chess/pieces/Pawn";
// import Queen from "../components/chess/pieces/Queen";
// import Rook from "../components/chess/pieces/Rook";

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
}

export const getJSXPieceArray = (
  piecesById: IPiecesById
): Array<JSX.Element> => {
  return byIdToPieceArray(piecesById).map(getJSXPiece);
};

const getJSXPiece = (props: IPiece): JSX.Element => {
  const propsObj = { key: props.id, id: props.id };
  return <Bishop {...propsObj} />;
  // switch (props.type) {
  //   case PieceType.Bishop:
  //     return <Bishop {...propsObj} />;
  //   case PieceType.King:
  //     return <King {...propsObj} />;
  //   case PieceType.Knight:
  //     return <Knight {...propsObj} />;
  //   case PieceType.Pawn:
  //     return <Pawn {...propsObj} />;
  //   case PieceType.Queen:
  //     return <Queen {...propsObj} />;
  //   case PieceType.Rook:
  //     return <Rook {...propsObj} />;
  //   default:
  //     return <Pawn {...propsObj} />;
  // }
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
      isWhite: isWhite
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
      isWhite: isWhite
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
      isWhite: isWhite
    };
    piecesById[(baseId + 5).toString()] = {
      type: PieceType.Bishop,
      col: 5,
      row: baseRow,
      isWhite: isWhite
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
      isWhite: isWhite
    };
    for (let j = startPawnLoop; j < endPawnLoop; j++) {
      piecesById[j.toString()] = {
        type: PieceType.Pawn,
        col: j - startPawnLoop,
        row: pawnRow,
        isWhite: isWhite
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
