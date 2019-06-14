import React, { Component } from "react";
import { Dispatch } from "redux";
import styled from "styled-components";
import { connect } from "react-redux";
import { initSetup, setSize } from "../../store/board/actions";
import { IApplicationState } from "../../store";
import Border from "./Border";
import Fields from "./Fields";
import Pieces from "./pieces/Pieces";
import PieceSelector from "./pieces/Selector";

interface IStateProps {
  size: number;
  isGameOver: boolean;
  pawnIdToChange: string;
}

interface IDispatchProps {
  initSetup: () => void;
  setSize: (size: number) => void;
}

type Props = IDispatchProps & IStateProps;

const Container = styled.div<{ size: number }>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

class Board extends Component<Props, {}> {
  componentDidMount() {
    window.addEventListener("resize", this.setBorderSize);
    this.props.initSetup();
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
    const { size, pawnIdToChange, isGameOver } = this.props;
    return (
      <Container size={size}>
        <Border />
        <Fields />
        <Pieces />
        {pawnIdToChange !== "-1" && !isGameOver ? <PieceSelector /> : null}
      </Container>
    );
  }
}
const mapStateToProps = (state: IApplicationState) => {
  return {
    size: state.board.size,
    isGameOver: state.board.isGameOver,
    pawnIdToChange: state.board.pawnIdToChange
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps => {
  return {
    initSetup: () => dispatch(initSetup()),
    setSize: (size: number) => dispatch(setSize(size))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
