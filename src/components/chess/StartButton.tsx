import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { startGame } from "../../store/board/actions";
import { resetClock } from "../../store/clock/actions";
import styled from "styled-components";

const Button = styled.button`
  background: red;
  position: absolute;
  top: 0;
`;

interface IDispatch {
  startGame: () => void;
  resetClock: () => void;
}

type Props = IDispatch;

const StartButton: React.FC<Props> = ({
  startGame,
  resetClock
}): JSX.Element => {
  const handleClick = () => {
    resetClock();
    startGame();
  };
  return <Button onClick={handleClick}>START NEW GAME</Button>;
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatch => {
  return {
    startGame: () => dispatch(startGame()),
    resetClock: () => dispatch(resetClock())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(StartButton);
