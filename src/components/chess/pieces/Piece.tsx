import React, { Component, CSSProperties } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IApplicationState } from "../../../store";
import { IPieceData, IMove } from "../../../store/board/types";
import { move } from "../../../store/board/actions";
import { areObjEqual } from "../../../utils/objects";
import { StyledPiece } from "./styles";

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

class Piece extends Component<Props, IState> {
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
  handleMouseMove = (e: MouseEvent): void => {
    if (this.state.mousePressing) {
      this.setState({ mouseX: e.clientX, mouseY: e.clientY });
    }
  };
  handleMouseUp = (): void => {
    if (this.state.mousePressing) {
      window.removeEventListener("mouseup", this.handleMouseUp);
      window.removeEventListener("mousemove", this.handleMouseMove);

      const { mouseX, mouseY } = this.state;
      const { size, id, move } = this.props;
      const x = mouseX - window.innerWidth / 2 + size / 2;
      const y = mouseY - window.innerHeight / 2 + size / 2;
      const col = 7 - (7 - Math.floor(x / (size / 8)));
      const row = 7 - Math.floor(y / (size / 8));

      move({ id, targetPosition: { col, row } });
      this.setState({ mousePressing: false, mouseX: -1, mouseY: -1 });
    }
  };
  getStyle = (): CSSProperties => {
    if (this.state.mousePressing) return this.getMovingStyle();
    else return this.getStaticStyle();
  };
  getMovingStyle = (): CSSProperties => {
    const { mouseX, mouseY } = this.state;
    const { size } = this.props;
    const x = mouseX - window.innerWidth / 2 + size / 2 - size / 16;
    const y = mouseY - window.innerHeight / 2 + size / 2 - size / 16;
    return { left: `${x.toString()}px`, top: `${y.toString()}px`, zIndex: 10 };
  };
  getStaticStyle = (): CSSProperties => {
    const { row, col } = this.props.data;
    return { left: `${12.5 * col}%`, top: `${87.5 - 12.5 * row}%` };
  };
  render() {
    return (
      <StyledPiece
        {...this.props.data}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        style={this.getStyle()}
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
)(Piece);
