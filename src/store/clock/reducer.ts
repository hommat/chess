import { Reducer } from "redux";
import { ClockState, ClockActionTypes } from "./types";

const initState: ClockState = {
  whiteTime: {
    minutes: 5,
    seconds: 0
  },
  blackTime: {
    minutes: 5,
    seconds: 0
  }
};

const reducer: Reducer<ClockState> = (state = initState, action) => {
  switch (action.type) {
    case ClockActionTypes.RESET:
      return {
        whiteTime: { ...initState.whiteTime },
        blackTime: { ...initState.blackTime }
      };
    case ClockActionTypes.SET:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export { reducer as clockReducer };
