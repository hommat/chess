import { action } from "typesafe-actions";
import { ClockActionTypes, Time } from "./types";
import store from "../";

export const resetClock = () => action(ClockActionTypes.RESET);

export const setTime = (isWhite: boolean) => {
  const property: string = isWhite ? "whiteTime" : "blackTime";
  const newTime: Time = {
    ...store.getState().clock[isWhite ? "whiteTime" : "blackTime"]
  };
  if (newTime.seconds === 0) {
    newTime.minutes -= 1;
    newTime.seconds = 60;
  }
  newTime.seconds -= 1;

  const payload = { [property]: newTime };
  return action(ClockActionTypes.SET, payload);
};
