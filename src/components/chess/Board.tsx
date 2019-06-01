import React from "react";
import styled from "styled-components";
import Border from "./Border";
import Fields from "./Fields";
import Pieces from "./Pieces";

const Container = styled.div`
  position: relative;
  width: 500px;
  height: 500px;
`;

const Board: React.FC = (): JSX.Element => {
  return (
    <Container>
      <Border />
      <Fields />
      <Pieces />
    </Container>
  );
};

export default Board;
