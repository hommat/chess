import React, { Component } from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { connect } from "react-redux";
import { resetBoard } from "../../store/board/actions";
import Border from "./Border";
import Fields from "./Fields";
import Pieces from "./pieces/Pieces";
import TestElement from "./TestElement";

interface IDispatchProps {
  resetBoard: () => void;
}

type Props = IDispatchProps;

interface IState {
  size: number;
}

const Container = styled.div<IState>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

class Board extends Component<Props, IState> {
  readonly state: IState = {
    size: 0
  };
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
    if (this.state.size !== newSize) this.setState({ size: newSize });
  };
  render() {
    return (
      <Container size={this.state.size}>
        <TestElement />
        <Border />
        <Fields />
        <Pieces />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    resetBoard: () => dispatch(resetBoard())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Board);
