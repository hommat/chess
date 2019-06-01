import React from "react";
import {getInitFieldArray, IField} from "../../utils/field";
import Field from "./Field";

const Fields: React.FC = (): JSX.Element => {
  return (
    <div>
      {getInitFieldArray().map((field:IField):JSX.Element => {
        return <Field key={`${field.row}_${field.col}`} {...field}/>
      })}
    </div>
  );
};

export default Fields;
