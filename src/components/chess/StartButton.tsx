import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { startGame } from "../../store/board/actions";
import styled from "styled-components";

const Button = styled.button`
  background: red;
  position: absolute;
  top: 0;
`;

interface IDispatch {
  startGame: () => void;
}

type Props = IDispatch;

const StartButton: React.FC<Props> = ({ startGame }): JSX.Element => {
  return <Button onClick={() => startGame()}>START NEW GAME</Button>;
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatch => {
  return {
    startGame: () => dispatch(startGame())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(StartButton);
