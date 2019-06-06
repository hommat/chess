import React from "react";
import { IApplicationState } from "../../store";
import { BoardState } from "../../store/board/types";
import { connect } from "react-redux";

interface ITestProps {
  board: BoardState;
}

const TestElement: React.FC<ITestProps> = props => {
  return <h1>text</h1>;
};

const mapStateToProps = (state: IApplicationState) => {
  return {
    board: state.board
  };
};

export default connect(mapStateToProps)(TestElement);
