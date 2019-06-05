import React, { Component } from "react";
import { AppState } from "../../../store/rootReducer";
import { IBoardState } from "../../../store/board/types";
import { connect } from "react-redux";
import { getJSXPieceArray } from "../../../utils/piece";

interface IStateProps {
  board: IBoardState;
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

const mapStateToProps = (state: AppState): IStateProps => {
  return {
    board: state.board
  };
};

export default connect(mapStateToProps)(Pieces);
