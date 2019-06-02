import React from "react";
import { IPiece } from "../../../utils/piece";
import { Piece } from "./styles";

const King: React.FC<IPiece> = (props): JSX.Element => {
  const { id, ...rest } = props;
  return <Piece {...rest} />;
};

export default King;
