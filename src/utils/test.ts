import { ShallowWrapper, HTMLAttributes } from "enzyme";

export const findByTestAtrr = (
  component: ShallowWrapper<React.FC> | ShallowWrapper<React.Component>,
  attr: string
):ShallowWrapper<HTMLAttributes> => {
  const wrapper: ShallowWrapper<HTMLAttributes> = component.find(`[data-test='${attr}']`);
  return wrapper;
};
