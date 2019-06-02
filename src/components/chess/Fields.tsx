import React from "react";
import { getJSXFieldArray } from "../../utils/field";

const Fields: React.FC = (): JSX.Element => {
  const fieldArray: Array<JSX.Element> = getJSXFieldArray();
  return <div>{fieldArray}</div>;
};

export default Fields;
