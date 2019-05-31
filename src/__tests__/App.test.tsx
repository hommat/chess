import React from "react";
import { shallow, ShallowWrapper, HTMLAttributes } from "enzyme";
import { findByTestAtrr } from "../utils/test";
import App from "../App";

const setUp = (): ShallowWrapper<React.FC> => {
  const wrapper: ShallowWrapper<React.FC> = shallow<React.FC>(<App />);
  return wrapper;
};

describe("App componenet", (): void => {
  let wrapper: ShallowWrapper<React.FC>;
  beforeEach(
    (): void => {
      wrapper = setUp();
    }
  );

  it("Should render one ChessBoard", (): void => {
    const component: ShallowWrapper<HTMLAttributes> = findByTestAtrr(
      wrapper,
      "chessBoardComponent"
    );
    expect(component.length).toBe(1);
  });
});
