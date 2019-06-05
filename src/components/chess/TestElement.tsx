import React from "react";
import { AppState } from "../../store/rootReducer";
import { IBoardState } from "../../store/board/types";
import { connect } from "react-redux";

interface ITestProps {
  board: IBoardState;
}

const TestElement: React.FC<ITestProps> = props => {
  return <h1>text</h1>;
};

const mapStateToProps = (state: AppState) => {
  return {
    board: state.board
  };
};

export default connect(mapStateToProps)(TestElement);
