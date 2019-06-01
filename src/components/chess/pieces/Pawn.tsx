import React from "react";
import { IPiece } from "../../../utils/piece";
import { Piece } from "./Styles";

const Pawn: React.FC<IPiece> = (props): JSX.Element => {
  const { id, ...rest } = props;
  return <Piece {...rest} />;
};

export default Pawn;
