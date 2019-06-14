import React, { Component } from "react";
import { Dispatch } from "redux";
import { IApplicationState } from "../../store";
import { connect } from "react-redux";
import { startGame } from "../../store/board/actions";
import styled from "styled-components";

const TimerContainer = styled.div`
  background: red;
  height: 100px;
  width: 200px;
  position: absolute;
  bottom: 0;
`;

interface IState {
  minutes: number;
  seconds: number;
}

interface IStateProps {
  isGameOver: boolean;
  isWhiteMove: boolean;
}

interface IOwnProps {
  isWhite: boolean;
}

type Props = IStateProps & IOwnProps;

class Timer extends Component<Props, IState> {
  readonly state: IState = {
    minutes: 0,
    seconds: 20
  };
  componentDidMount() {
    setInterval(() => {
      this.setState({ seconds: this.state.seconds - 1 });
    }, 1000);
  }
  render() {
    const { minutes, seconds } = this.state;
    return <TimerContainer>{`${minutes}:${seconds}`}</TimerContainer>;
  }
}

const mapStateToProps = (state: IApplicationState): IStateProps => {
  return {
    isGameOver: state.board.isGameOver,
    isWhiteMove: state.board.isWhiteMove
  };
};

export default connect(mapStateToProps)(Timer);
