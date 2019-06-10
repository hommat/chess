import { Reducer } from "redux";
import { BoardState, BoardActionTypes } from "./types";

const initState: BoardState = {
  pieces: {
    byId: {},
    allIds: []
  },
  size: 0,
  isGameOver: false,
  isWhiteMove: true
};

const reducer: Reducer<BoardState> = (state = initState, action) => {
  switch (action.type) {
    case BoardActionTypes.SET_SIZE:
      return {
        ...state,
        size: action.payload
      };
    case BoardActionTypes.RESET:
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        }
      };
    case BoardActionTypes.MOVE:
      return {
        ...state,
        isWhiteMove: !state.isWhiteMove,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        }
      };
    case BoardActionTypes.CHECK_MATE:
      console.log(`The winner is ${action.payload ? "white" : "black"}`);
      return {
        ...state,
        isGameOver: true
      };
    case BoardActionTypes.MOVE_FAILED:
    default:
      return state;
  }
};

export { reducer as boardReducer };
