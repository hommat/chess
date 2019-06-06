import React, { Component } from "react";
import { IApplicationState } from "../../../store";
import { BoardState } from "../../../store/board/types";
import { connect } from "react-redux";
import { getJSXPieceArray } from "../../../utils/piece";

interface IStateProps {
  board: BoardState;
}

type Props = IStateProps;

class Pieces extends Component<Props, {}> {
  shouldComponentUpdate(nextProps: Props) {
    const actualLength = this.props.board.pieces.allIds.length;
    const nextLength = nextProps.board.pieces.allIds.length;
    return actualLength !== nextLength;
  }
  render() {
    const { byId } = this.props.board.pieces;
    const JSXpieceArray: Array<JSX.Element> = getJSXPieceArray(byId);
    return <div>{JSXpieceArray}</div>;
  }
}

const mapStateToProps = (state: IApplicationState): IStateProps => {
  return {
    board: state.board
  };
};

export default connect(mapStateToProps)(Pieces);
