import React from "react";
import { AppState } from "../../../store/rootReducer";
import { IPieceData } from "../../../store/board/types";
import { connect } from "react-redux";
import { Piece } from "./styles";

interface IStateProps {
  data: IPieceData;
}

interface IOwnProps {
  id: string;
}

type Props = IStateProps & IOwnProps;

const Knight: React.FC<Props> = ({ id, data }): JSX.Element => {
  return <Piece {...data} />;
};

const mapStateToProps = (state: AppState, ownProps: IOwnProps): IStateProps => {
  return {
    data: state.board.pieces.byId[ownProps.id]
  };
};

export default connect(mapStateToProps)(Knight);
