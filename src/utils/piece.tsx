import React from "react";
import Bishop from "../components/chess/pieces/Bishop";
import King from "../components/chess/pieces/King";
import Knight from "../components/chess/pieces/Knight";
import Pawn from "../components/chess/pieces/Bishop";
import Queen from "../components/chess/pieces/Queen";
import Rook from "../components/chess/pieces/Rook";

export enum PieceType {
  Pawn,
  Rook,
  Knight,
  Bishop,
  Queen,
  King
}

export interface IPiece {
  id?: number;
  type: PieceType;
  col: number;
  row: number;
  isWhite: boolean;
}

export const getJSXPieceArray = (
  pieceArray: Array<IPiece> = getInitPieceArray()
): Array<JSX.Element> => {
  return pieceArray.map(getJSXPiece);
};

const getJSXPiece = (props: IPiece): JSX.Element => {
  const { type, id, ...rest } = props;
  switch (type) {
    case PieceType.Bishop:
      return <Bishop key={id} type={type} {...rest} />;
    case PieceType.King:
      return <King key={id} type={type} {...rest} />;
    case PieceType.Knight:
      return <Knight key={id} type={type} {...rest} />;
    case PieceType.Pawn:
      return <Pawn key={id} type={type} {...rest} />;
    case PieceType.Queen:
      return <Queen key={id} type={type} {...rest} />;
    case PieceType.Rook:
      return <Rook key={id} type={type} {...rest} />;
    default:
      return <Pawn key={id} type={type} {...rest} />;
  }
};

const getInitPieceArray = (): Array<IPiece> => {
  const pieceArray: Array<IPiece> = [];
  for (let i = 0; i < 2; i++) {
    const baseId: number = i * 16;
    const baseRow: number = i * 7;
    const pawnRow: number = baseRow === 0 ? 1 : 6;
    const startPawnLoop: number = baseId + 8;
    const endPawnLoop: number = baseId + 16;
    const isWhite: boolean = i === 0;

    pieceArray.push({
      id: baseId + 0,
      type: PieceType.Rook,
      col: 0,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 1,
      type: PieceType.Knight,
      col: 1,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 2,
      type: PieceType.Bishop,
      col: 2,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 3,
      type: PieceType.Queen,
      col: 3,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 4,
      type: PieceType.King,
      col: 4,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 5,
      type: PieceType.Bishop,
      col: 5,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 6,
      type: PieceType.Knight,
      col: 6,
      row: baseRow,
      isWhite: isWhite
    });
    pieceArray.push({
      id: baseId + 7,
      type: PieceType.Rook,
      col: 7,
      row: baseRow,
      isWhite: isWhite
    });
    for (let j = startPawnLoop; j < endPawnLoop; j++) {
      pieceArray.push({
        id: j,
        type: PieceType.Pawn,
        col: j - startPawnLoop,
        row: pawnRow,
        isWhite: isWhite
      });
    }
  }

  return pieceArray;
};
