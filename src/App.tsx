import React, { Fragment } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Board from "./components/chess/Board";
import StartButton from "./components/chess/StartButton";
import Results from "./components/chess/Results";
import Timer from "./components/chess/Timer";

const GlobalStyle = createGlobalStyle`
  body {
    background: #1e1e1e;
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
  flex-direction: column;
`;

const App: React.FC = (): JSX.Element => {
  return (
    <Fragment>
      <GlobalStyle />
      <Container>
        <Timer isWhite={false} />
        <Board />
        <Timer isWhite={true} />
        <StartButton />
        <Results />
      </Container>
    </Fragment>
  );
};

export default App;
