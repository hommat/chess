export interface IField {
  row: number;
  col: number;
  isWhite: boolean;
}

export const getInitFieldArray = (): Array<IField> => {
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
