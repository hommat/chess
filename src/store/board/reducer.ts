import { IBoardState, BoardActionTypes } from "./types";
import Constants from "./constants";

const initState: IBoardState = {
  pieces: {
    byId: {},
    allIds: []
  }
};

const boardReducer = (
  state: IBoardState = initState,
  action: BoardActionTypes
): IBoardState => {
  switch (action.type) {
    case Constants.RESET_BOARD:
    case Constants.MOVE:
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        }
      };
    default:
      return { ...initState };
  }
};

export default boardReducer;
