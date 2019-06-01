import React from "react";
import { getInitPieceArray, IPiece, PieceType } from "../../utils/piece";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Bishop";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

const getJSXPiece = (props: IPiece) => {
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

const Pieces: React.FC = (): JSX.Element => {
  const pieceArray: Array<IPiece> = getInitPieceArray();
  return (
    <div>
      {pieceArray.map(getJSXPiece)}
    </div>
  )
};

export default Pieces;
