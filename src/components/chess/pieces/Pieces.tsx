import React from "react";
import { getJSXPieceArray } from "../../../utils/piece";

const Pieces: React.FC = (): JSX.Element => {
  const pieceArray: Array<JSX.Element> = getJSXPieceArray();
  return <div>{pieceArray}</div>;
};

export default Pieces;
