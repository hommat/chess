import { createStore, combineReducers } from "redux";

import { BoardState } from "./board/types";
import { boardReducer } from "./board/reducer";

export interface IApplicationState {
  board: BoardState;
}

const createRootReducer = () =>
  combineReducers({
    board: boardReducer
  });

const store = createStore(createRootReducer());

export default store;
