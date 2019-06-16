import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { startGame } from "../../store/board/actions";
import { resetClock } from "../../store/clock/actions";
import { IApplicationState } from "../../store";
import styled, { keyframes } from "styled-components";

const showButton = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Button = styled.button`
  background: #1e1e1e;
  position: absolute;
  padding: 13px 9px;
  transform: translateY(15px);
  border: none;
  cursor: pointer;
  bottom: 50%;
  color: white;
  opacity: 1;
  transition: 0.4s;
  animation: 1s ${showButton} linear;

  :focus {
    outline: none;
  }

  :hover {
    opacity: 0.95;
  }
`;

interface IState {
  isGameOver: boolean;
}

interface IDispatch {
  startGame: () => void;
  resetClock: () => void;
}

type Props = IDispatch & IState;

const StartButton: React.FC<Props> = ({
  startGame,
  resetClock,
  isGameOver
}) => {
  const handleClick = () => {
    resetClock();
    startGame();
  };
  if (!isGameOver) return null;
  return <Button onClick={handleClick}>START NEW GAME</Button>;
};

const mapStateToProps = (state: IApplicationState): IState => {
  return {
    isGameOver: state.board.isGameOver
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatch => {
  return {
    startGame: () => dispatch(startGame()),
    resetClock: () => dispatch(resetClock())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartButton);
