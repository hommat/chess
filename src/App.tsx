import React, {Fragment} from "react";
import styled, {createGlobalStyle} from "styled-components";
import Board from "./components/chess/Board";

const GlobalStyle = createGlobalStyle`
  body {
    background: black;
    padding: 0;
    margin: 0;
    font-family: sans serif;
  }
`

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

const App: React.FC = (): JSX.Element => {
  return (
    <Fragment>  
      <GlobalStyle />
      <Container>
        <Board data-test="chessBoardComponent">Welcome</Board>
      </Container>
    </Fragment>
  );
};

export default App;
