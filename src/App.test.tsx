import React from 'react';
import {shallow} from 'enzyme';
import App from "./App";

it('testing enzyme and jest', () => {
  console.log(shallow(<App />).debug());

  expect(2+2).toBe(4)
});
