import React, { Fragment } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Board from "./components/chess/Board";
import StartButton from "./components/chess/StartButton";
import Timer from "./components/chess/Timer";

const GlobalStyle = createGlobalStyle`
  body {
    background: black;
    padding: 0;
    margin: 0;
    font-family: sans serif;
    overflow: hidden;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const App: React.FC = (): JSX.Element => {
  return (
    <Fragment>
      <GlobalStyle />
      <Container>
        <Board />
        <StartButton />
        <Timer isWhite={true} />
        <Timer isWhite={false} />
      </Container>
    </Fragment>
  );
};

export default App;
