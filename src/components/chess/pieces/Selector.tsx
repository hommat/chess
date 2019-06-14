import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { IApplicationState } from "../../../store";
import { changePawn } from "../../../store/board/actions";
import styled from "styled-components";
import { getImage } from "../../../utils/image";
import { PieceType } from "../../../utils/piece";

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  display: grid;
  grid-gap: 15px;
  padding: 15px;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 40%;
  top: 30%;
  background: brown;
  z-index: 1000000;
`;

const SelectorPiece = styled.div<{ type: PieceType; isWhite: boolean }>`
  width: 100%;
  height: auto;
  background-image: url(${props => getImage(props.type, props.isWhite)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  :hover {
    cursor: pointer;
  }
`;

interface IState {
  isWhite: boolean;
}

interface IDispatch {
  changePawn: (type: PieceType) => void;
}

type Props = IState & IDispatch;

const Selector: React.FC<Props> = ({ isWhite, changePawn }): JSX.Element => {
  return (
    <Container>
      <SelectorPiece
        type={PieceType.Knight}
        isWhite={isWhite}
        onClick={() => changePawn(PieceType.Knight)}
      />
      <SelectorPiece
        type={PieceType.Bishop}
        isWhite={isWhite}
        onClick={() => changePawn(PieceType.Bishop)}
      />{" "}
      <SelectorPiece
        type={PieceType.Rook}
        isWhite={isWhite}
        onClick={() => changePawn(PieceType.Rook)}
      />{" "}
      <SelectorPiece
        type={PieceType.Queen}
        isWhite={isWhite}
        onClick={() => changePawn(PieceType.Queen)}
      />
    </Container>
  );
};

const mapStateToProps = (state: IApplicationState): IState => {
  return {
    isWhite: state.board.pieces.byId[state.board.pawnIdToChange].isWhite
  };
};

const mapDispatchToProps = (dispatch: Dispatch): IDispatch => {
  return {
    changePawn: (type: PieceType) => dispatch(changePawn(type))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selector);
