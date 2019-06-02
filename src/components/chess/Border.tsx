import React from "react";
import { getArrBorderElements } from "../../utils/border";
import styled from "styled-components";

interface IVerticalElement {
  row: number;
}

interface IHorizontalElement {
  col: number;
}

interface ICorner {
  top: boolean;
  left: boolean;
}

const Container = styled.div`
  user-select: none;
  color: white;
`;

const Element = styled.div`
  background: brown;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const HorizontalElement = styled(Element)<IHorizontalElement>`
  width: 12.5%;
  height: 5%;
  left: ${({ col }) => col * 12.5}%;
`;

const VerticalElement = styled(Element)<IVerticalElement>`
  width: 5%;
  height: 12.5%;
  top: ${({ row }) => 87.5 - row * 12.5}%;
`;

const BottomElement = styled(HorizontalElement)<IHorizontalElement>`
  bottom: -5%;
`;

const TopElement = styled(HorizontalElement)<IHorizontalElement>`
  top: -5%;
`;

const LeftElement = styled(VerticalElement)<IVerticalElement>`
  left: -5%;
`;

const RightElement = styled(VerticalElement)<IVerticalElement>`
  right: -5%;
`;

const Corner = styled(Element)<ICorner>`
  height: 5%;
  width: 5%;
  top: ${({ top }) => (top ? -5 : 100)}%;
  left: ${({ left }) => (left ? -5 : 100)}%;
`;

const Border: React.FC = (): JSX.Element => {
  return (
    <Container>
      {getArrBorderElements(BottomElement, true)}
      {getArrBorderElements(TopElement, true)}
      {getArrBorderElements(LeftElement, false)}
      {getArrBorderElements(RightElement, false)}
      <Corner top={true} left={true} />
      <Corner top={true} left={false} />
      <Corner top={false} left={false} />
      <Corner top={false} left={true} />
    </Container>
  );
};

export default Border;
