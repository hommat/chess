import styled from "styled-components";
import { PieceType } from "../../../utils/piece";
import { getImage } from "../../../utils/image";

interface IPieceStyle {
  type: PieceType;
  isWhite: boolean;
}

export const Piece = styled.div<IPieceStyle>`
  position: absolute;
  width: 12.5%;
  user-select: none;
  height: 12.5%;
  background-image: url(${props => getImage(props.type, props.isWhite)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`;
