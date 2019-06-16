import React from "react";
import { IApplicationState } from "../../store";
import { connect } from "react-redux";
import styled, { keyframes } from "styled-components";

interface IState {
  isWinner: boolean;
  isWinnerWhite: boolean;
  isDraw: boolean;
}

type Props = IState;

const showResults = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  background: #1e1e1e;
  position: absolute;
  padding: 13px 9px;
  border: none;
  bottom: 50%;
  transform: translateY(-40px);
  animation: 1s ${showResults} linear;
  color: white;
`;

const Results: React.FC<Props> = ({ isWinner, isWinnerWhite, isDraw }) => {
  if (!isWinner && !isDraw) return null;
  const resultText = isDraw
    ? "DRAW"
    : `THE WINNER IS ${isWinnerWhite ? "WHITE" : "BLACK"}`;
  return <Container>{resultText}</Container>;
};

const mapStateToProps = (state: IApplicationState): IState => {
  return {
    isWinner: state.board.isWinner,
    isWinnerWhite: state.board.isWinnerWhite,
    isDraw: state.board.isDraw
  };
};

export default connect(mapStateToProps)(Results);
