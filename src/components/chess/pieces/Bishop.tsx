import React, { Component } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { AppState } from "../../../store/rootReducer";
import { IPieceData, IMove } from "../../../store/board/types";
import { move } from "../../../store/board/actions";
import { areObjEqual } from "../../../utils/objects";
import { Piece } from "./styles";

interface IStateProps {
  data: IPieceData;
}

interface IDispatch {
  move: (pieceData: IMove) => void;
}

interface IOwnProps {
  id: string;
}

type Props = IStateProps & IDispatch & IOwnProps;

class Bishop extends Component<Props, {}> {
  shouldComponentUpdate(nextProps: Props) {
    const { id, data } = this.props;
    if (id !== nextProps.id) return true;
    if (!areObjEqual(data, nextProps.data)) return true;
    return false;
  }
  render() {
    const { id, data, move } = this.props;
    return (
      <Piece
        {...data}
        onClick={() => move({ id, targetCol: 4, targetRow: 4 })}
      />
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: IOwnProps): IStateProps => {
  return {
    data: state.board.pieces.byId[ownProps.id]
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatch => {
  return {
    move: (pieceData: IMove) => dispatch(move(pieceData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Bishop);
