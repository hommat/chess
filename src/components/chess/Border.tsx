import React from "react";
import styled from "styled-components";

interface IVerticalElement {
  row: number;
}

interface IHorizontalElement {
  col: number;
}

const hor = "ABCDEFGH";
const vert = "12345678";

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

const TopElement = styled(HorizontalElement)<IHorizontalElement>`
  bottom: -5%;
`;

const BottomElement = styled(HorizontalElement)<IHorizontalElement>`
  top: -5%;
`;

const LeftEleemnt = styled(VerticalElement)<IVerticalElement>`
  left: -5%;
`;

const RightElement = styled(VerticalElement)<IVerticalElement>`
  right: -5%;
`;

const Border: React.FC = (): JSX.Element => {
  return (
    <Container>
      {new Array(8).fill(0).map((x, i) => (
        <BottomElement col={i} key={i}>{hor[i]}</BottomElement>
      ))}
      {new Array(8).fill(0).map((x, i) => (
        <TopElement col={i} key={i}>{hor[i]}</TopElement>
      ))}
      {new Array(8).fill(0).map((x, i) => (
        <LeftEleemnt row={i} key={i}>{vert[i]}</LeftEleemnt>
      ))}
      {new Array(8).fill(0).map((x, i) => (
        <RightElement row={i} key={i}>{vert[i]}</RightElement>
      ))}
    </Container>
  );
};

export default Border;
