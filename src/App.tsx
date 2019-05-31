import React, { Fragment } from "react";
import ChessBoard from "./components/ChessBoard";

const App: React.FC = (): JSX.Element => {
  return (
    <Fragment>
      <ChessBoard data-test="chessBoardComponent">Welcome</ChessBoard>
    </Fragment>
  );
};

export default App;
