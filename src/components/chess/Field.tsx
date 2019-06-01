import React from "react";
import styled from "styled-components";
import { IField } from "../../utils/field";

interface IFieldContainer {
  row: number;
  col: number;
  isWhite: boolean;
}

const Container = styled.div<IFieldContainer>`
  position: absolute;
  width: 12.5%;
  height: 12.5%;
  background: ${props => (props.isWhite ? "white" : "grey")}
  top: ${({row}) => 87.5 - 12.5 * row}%;
  left: ${({col}) => 12.5 * col}%;
`;

const Field: React.FC<IField> = ({ row, col, isWhite }): JSX.Element => {
  const handleClick = (e:any) => console.log(row, col);
  return <Container row={row} col={col} isWhite={isWhite} onClick={handleClick}/>;
};

export default Field;
