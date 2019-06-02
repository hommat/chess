import React, { Component } from "react";
import styled from "styled-components";
import Border from "./Border";
import Fields from "./Fields";
import Pieces from "./pieces/Pieces";

interface IBoardProps {}

interface IBoardState {
  size: number;
}

const Container = styled.div<IBoardState>`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`;

class Board extends Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);
    this.state = {
      size: 0
    };
    this.setBorderSize = this.setBorderSize.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.setBorderSize);
    this.setBorderSize();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.setBorderSize);
  }
  setBorderSize(): void {
    const { innerWidth, innerHeight } = window;
    const screenPercent = 80;
    const newSize = Math.floor(
      (Math.min(innerWidth, innerHeight) * screenPercent) / 100
    );
    if (this.state.size !== newSize) this.setState({ size: newSize });
  }
  render() {
    return (
      <Container size={this.state.size}>
        <Border />
        <Fields />
        <Pieces />
      </Container>
    );
  }
}

export default Board;
