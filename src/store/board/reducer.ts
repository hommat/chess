import { Reducer } from "redux";
import { BoardState, BoardActionTypes } from "./types";

const initState: BoardState = {
  pieces: {
    byId: {},
    allIds: []
  },
  positions: {
    allPositions: [],
    allOccurTimes: []
  },
  pawnIdToChange: "-1",
  movesTo50Rule: 0,
  size: 0,
  isGameOver: true,
  isWinner: false,
  isWinnerWhite: false,
  isDraw: false,
  isWhiteMove: true
};

const reducer: Reducer<BoardState> = (state = initState, action) => {
  switch (action.type) {
    case BoardActionTypes.SET_SIZE:
      return {
        ...state,
        size: action.payload
      };
    case BoardActionTypes.INIT_SETUP:
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        }
      };
    case BoardActionTypes.START:
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        },
        positions: { ...initState.positions },
        pawnIdToChange: "-1",
        movesTo50Rule: 0,
        isGameOver: false,
        isDraw: false,
        isWhiteMove: true,
        isWinner: false
      };
    case BoardActionTypes.MOVE:
      const isWhiteMove =
        action.payload.pawnIdToChange === "-1"
          ? !state.isWhiteMove
          : state.isWhiteMove;
      return {
        ...state,
        pieces: {
          byId: { ...action.payload.byId },
          allIds: [...action.payload.allIds]
        },
        positions: {
          allPositions: [...action.payload.allPositions],
          allOccurTimes: [...action.payload.allOccurTimes]
        },
        movesTo50Rule: action.payload.movesTo50Rule,
        pawnIdToChange: action.payload.pawnIdToChange,
        isWhiteMove
      };
    case BoardActionTypes.CHANGE_PAWN:
      return {
        ...state,
        pieces: {
          ...state.pieces,
          byId: action.payload.byId
        },
        isWhiteMove: !state.isWhiteMove,
        movesTo50Rule: 0,
        pawnIdToChange: "-1"
      };
    case BoardActionTypes.CHECK_MATE:
      return {
        ...state,
        pieces: {
          ...state.pieces,
          byId: action.payload.byId,
          allIds: action.payload.allIds
        },
        isGameOver: true,
        isWinner: true,
        isWinnerWhite: action.payload.isWhite
      };
    case BoardActionTypes.TIMEOUT:
      return {
        ...state,
        isGameOver: true,
        isWinner: true,
        isWinnerWhite: !action.payload
      };
    case BoardActionTypes.DRAW:
      return {
        ...state,
        pieces: {
          ...state.pieces,
          byId: action.payload.byId,
          allIds: action.payload.allIds
        },
        isGameOver: true,
        isDraw: true,
        isWinner: false
      };
    case BoardActionTypes.MOVE_FAILED:
    case BoardActionTypes.CHANGE_PAWN_FAILED:
    default:
      return state;
  }
};

export { reducer as boardReducer };
