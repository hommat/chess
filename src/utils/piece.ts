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

export const getInitPieceArray = (): Array<IPiece> => {
  const pieceArray: Array<IPiece> = [];
  pieceArray.push({id: 0, type: PieceType.Rook, col: 0, row: 0, isWhite: true});
  pieceArray.push({id: 1, type: PieceType.Knight, col: 1, row: 0, isWhite: true});
  pieceArray.push({id: 2, type: PieceType.Bishop, col: 2, row: 0, isWhite: true});
  pieceArray.push({id: 3, type: PieceType.Queen, col: 3, row: 0, isWhite: true});
  pieceArray.push({id: 4, type: PieceType.King, col: 4, row: 0, isWhite: true});
  pieceArray.push({id: 5, type: PieceType.Bishop, col: 5, row: 0, isWhite: true});
  pieceArray.push({id: 6, type: PieceType.Knight, col: 6, row: 0, isWhite: true});
  pieceArray.push({id: 7, type: PieceType.Rook, col: 7, row: 0, isWhite: true});
  for(let i = 8; i < 16; i++){
    pieceArray.push({id: i, type: PieceType.Pawn, col: i - 8, row: 1, isWhite: true});
  }

  pieceArray.push({id: 16, type: PieceType.Rook, col: 0, row: 7, isWhite: false});
  pieceArray.push({id: 17, type: PieceType.Knight, col: 1, row: 7, isWhite: false});
  pieceArray.push({id: 18, type: PieceType.Bishop, col: 2, row: 7, isWhite: false});
  pieceArray.push({id: 19, type: PieceType.Queen, col: 3, row: 7, isWhite: false});
  pieceArray.push({id: 20, type: PieceType.King, col: 4, row: 7, isWhite: false});
  pieceArray.push({id: 21, type: PieceType.Bishop, col: 5, row: 7, isWhite: false});
  pieceArray.push({id: 22, type: PieceType.Knight, col: 6, row: 7, isWhite: false});
  pieceArray.push({id: 23, type: PieceType.Rook, col: 7, row: 7, isWhite: false});
  for(let i = 24; i < 32; i++){
    pieceArray.push({id: i, type: PieceType.Pawn, col: i - 24, row: 6, isWhite: false});
  }
  return pieceArray;
};
