import React from "react";
import Field from "../components/chess/Field";

export interface IField {
  row: number;
  col: number;
  isWhite: boolean;
}

export const getJSXFieldArray = (
  fieldArray: Array<IField> = getInitFieldArray()
): Array<JSX.Element> => {
  return fieldArray.map(
    (field: IField): JSX.Element => (
      <Field key={`${field.row}_${field.col}`} {...field} />
    )
  );
};

const getInitFieldArray = (): Array<IField> => {
  const fieldsArray: Array<IField> = [];
  let isWhite: boolean = true;
  for (let row = 0; row < 8; row++) {
    isWhite = !isWhite;
    for (let col = 0; col < 8; col++) {
      isWhite = !isWhite;
      fieldsArray.push({ row, col, isWhite });
    }
  }
  return fieldsArray;
};
