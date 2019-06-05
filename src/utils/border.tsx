import React from "react";
import { StyledComponent, DefaultTheme } from "styled-components";

const hor = "ABCDEFGH";
const vert = "12345678";

export const getArrBorderElements = (
  BorderElement: StyledComponent<"div", DefaultTheme>,
  hasCol: boolean
): Array<JSX.Element> => {
  const charArr = hasCol ? hor : vert;
  return new Array(8).fill(0).map((x, i) => {
    let elementProps: Object;
    if (hasCol) elementProps = { key: i, col: i };
    else elementProps = { key: i, row: i };

    return <BorderElement {...elementProps}>{charArr[i]}</BorderElement>;
  });
};
