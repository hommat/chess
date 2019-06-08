import React, { Component } from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { connect } from "react-redux";
import { resetBoard, setSize } from "../../store/board/actions";
import { IApplicationState } from "../../store";
import Border from "./Border";
import Fields from "./Fields";
import Pieces from "./pieces/Pieces";

interface IStateProps {
  size: number;
}

interface IDispatchProps {
  resetBoard: () => void;
  setSize: (size: number) => void;
}

type Props = IDispatchProps & IStateProps;

const Container = styled.div<IStateProps>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

class Board extends Component<Props, {}> {
  componentDidMount() {
    window.addEventListener("resize", this.setBorderSize);
    this.props.resetBoard();
    this.setBorderSize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.setBorderSize);
  }
  setBorderSize = (): void => {
    const { innerWidth, innerHeight } = window;
    const screenPercent = 80;
    const newSize = Math.floor(
      (Math.min(innerWidth, innerHeight) * screenPercent) / 100
    );
    if (this.props.size !== newSize) {
      this.props.setSize(newSize);
    }
  };
  render() {
    return (
      <Container size={this.props.size}>
        <Border />
        <Fields />
        <Pieces />
      </Container>
    );
  }
}
const mapStateToProps = (state: IApplicationState) => {
  return {
    size: state.board.size
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    resetBoard: () => dispatch(resetBoard()),
    setSize: (size: number) => dispatch(setSize(size))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
