import React from "react";
import styled from "styled-components";
import { IField } from "../../utils/field";

interface FieldContainer {
  row: number;
  col: number;
  isWhite: boolean;
}

const Container = styled.div<FieldContainer>`
  position: absolute;
  width: 12.5%;
  height: 12.5%;
  background: ${props => (props.isWhite ? "white" : "grey")}
  top: ${({ row }) => 87.5 - 12.5 * row}%;
  left: ${({ col }) => 12.5 * col}%;
`;

const Field: React.FC<IField> = ({ row, col, isWhite }): JSX.Element => {
  return <Container row={row} col={col} isWhite={isWhite} />;
};

export default Field;
