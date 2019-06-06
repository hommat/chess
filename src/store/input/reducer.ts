import { IInputState, InputActionTypes } from "./types";
import Constants from "./constants";

const initState: IInputState = {
  isPressing: false,
  position: {
    col: 0,
    row: 0
  }
};

const inputReducer = (
  state: IInputState = initState,
  action: InputActionTypes
) => {
  switch (action.type) {
    case Constants.START_PRESSING:
    case Constants.STOP_PRESSING:
    case Constants.SET_POSITION:
      return {
        ...state,
        ...action.payload
      };
    default:
      return { ...state };
  }
};

export default inputReducer;
