import styled from "styled-components";
import { PieceType } from "../../../utils/piece";
import { getImage } from "../../../utils/image";

interface PieceStyle {
  row: number;
  col: number;
  type: PieceType;
  isWhite: boolean;
}

export const Piece = styled.div<PieceStyle>`
  position: absolute;
  width: 12.5%;
  height: 12.5%;
  background-image: url(${props => getImage(props.type, props.isWhite)});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  top: ${({ row }) => 87.5 - 12.5 * row}%;
  left: ${({ col }) => 12.5 * col}%;
`;
