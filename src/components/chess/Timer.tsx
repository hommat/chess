import React, { Component } from "react";
import { Dispatch } from "redux";
import { IApplicationState } from "../../store";
import { Time } from "../../store/clock/types";
import { connect } from "react-redux";
import { setTime } from "../../store/clock/actions";
import { timeout } from "../../store/board/actions";
import styled from "styled-components";

const TimerContainer = styled.div<IOwnProps>`
  background: ${props => (props.isWhite ? "#333333" : "#1a1a1a")};
  border-radius: ${props =>
    props.isWhite ? "0 0 15px 15px" : "15px 15px 0 0"};
  font-weight: bold;
  text-align: center;
  padding: 10px;
  height: 40px;
  bottom: 0;
  display: flex;
  align-items: center;
  color: #e3e3e3;
`;

interface IStateProps {
  isGameOver: boolean;
  isWhiteMove: boolean;
  time: Time;
}

interface IDispatchProps {
  setTime: (isWhite: boolean) => void;
  timeout: (isWhite: boolean) => void;
}

interface IOwnProps {
  isWhite: boolean;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

class Timer extends Component<Props, {}> {
  componentDidMount() {
    setInterval(() => {
      const { isGameOver, isWhiteMove, isWhite, time } = this.props;
      if (isWhiteMove === isWhite && !isGameOver) {
        if (time.seconds === 0 && time.minutes === 0)
          this.props.timeout(isWhite);
        else this.props.setTime(isWhite);
      }
    }, 1000);
  }
  render() {
    const { isWhite, time } = this.props;
    const { minutes, seconds } = time;
    const dislayMins: string = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const dislaySecs: string = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return (
      <TimerContainer isWhite={isWhite}>
        {`${dislayMins}:${dislaySecs}`}
      </TimerContainer>
    );
  }
}

const mapStateToProps = (
  state: IApplicationState,
  ownProps: IOwnProps
): IStateProps => {
  return {
    isGameOver: state.board.isGameOver,
    isWhiteMove: state.board.isWhiteMove,
    time: state.clock[ownProps.isWhite ? "whiteTime" : "blackTime"]
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    setTime: (isWhite: boolean) => dispatch(setTime(isWhite)),
    timeout: (isWhite: boolean) => dispatch(timeout(isWhite))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
