import { createStore, combineReducers } from "redux";

import { BoardState } from "./board/types";
import { boardReducer } from "./board/reducer";

import { ClockState } from "./clock/types";
import { clockReducer } from "./clock/reducer";

export interface IApplicationState {
  board: BoardState;
  clock: ClockState;
}

const createRootReducer = () =>
  combineReducers({
    board: boardReducer,
    clock: clockReducer
  });

const store = createStore(createRootReducer());

export default store;
