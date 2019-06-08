import { Reducer } from "redux";
import { BoardState, BoardActionTypes } from "./types";

const initState: BoardState = {
  pieces: {
    byId: {},
    allIds: []
  },
  size: 0
};

const reducer: Reducer<BoardState> = (state = initState, action) => {
  switch (action.type) {
    case BoardActionTypes.RESET:
    case BoardActionTypes.MOVE:
    case BoardActionTypes.CAPTURE_IN_PASSING:
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        }
      };
    case BoardActionTypes.SET_SIZE:
      return {
        ...state,
        size: action.payload
      };
    case BoardActionTypes.MOVE_FAILED:
    default:
      return state;
  }
};

export { reducer as boardReducer };
