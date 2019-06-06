import React, { Component, CSSProperties } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IApplicationState } from "../../../store";
import { IPieceData, IMove } from "../../../store/board/types";
import { move } from "../../../store/board/actions";
import { areObjEqual } from "../../../utils/objects";
import { Piece } from "./styles";

interface IStateProps {
  data: IPieceData;
  size: number;
}

interface IDispatch {
  move: (pieceData: IMove) => void;
}

interface IOwnProps {
  id: string;
}

interface IState {
  mousePressing: boolean;
  mouseX: number;
  mouseY: number;
}

type Props = IStateProps & IDispatch & IOwnProps;

class Bishop extends Component<Props, IState> {
  readonly state: IState = {
    mousePressing: false,
    mouseX: -1,
    mouseY: -1
  };
  shouldComponentUpdate(nextProps: Props, nextState: IState) {
    const { id, data } = this.props;
    if (id !== nextProps.id) return true;
    if (!areObjEqual(data, nextProps.data)) return true;
    if (!areObjEqual(this.state, nextState)) return true;
    return false;
  }
  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    window.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("mousemove", this.handleMouseMove);
    this.setState({
      mousePressing: true,
      mouseX: e.clientX,
      mouseY: e.clientY
    });
  };
  handleMouseUp = (): void => {
    if (this.state.mousePressing) {
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener("mousemove", this.handleMouseMove);
      this.setState({ mousePressing: false, mouseX: -1, mouseY: -1 });
    }
  };
  handleMouseMove = (e: MouseEvent): void => {
    if (this.state.mousePressing) {
      this.setState({ mouseX: e.clientX, mouseY: e.clientY });
    }
  };
  getAbsoluteStyle = (): CSSProperties => {
    if (this.state.mousePressing) return this.getMovingStyle();
    else return this.getStaticStyle();
  };
  getMovingStyle = (): CSSProperties => {
    const { mouseX, mouseY } = this.state;
    const { size } = this.props;
    const x = mouseX - window.innerWidth / 2 + size / 2 - size / 16;
    const y = mouseY - window.innerHeight / 2 + size / 2 - size / 16;
    return { left: `${x.toString()}px`, top: `${y.toString()}px` };
  };
  getStaticStyle = (): CSSProperties => {
    const { row, col } = this.props.data;
    return { left: `${87.5 - 12.5 * col}%`, top: `${87.5 - 12.5 * row}%` };
  };
  render() {
    return (
      <Piece
        {...this.props.data}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        style={this.getAbsoluteStyle()}
      />
    );
  }
}

const mapStateToProps = (
  state: IApplicationState,
  ownProps: IOwnProps
): IStateProps => {
  return {
    data: state.board.pieces.byId[ownProps.id],
    size: state.board.size
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
