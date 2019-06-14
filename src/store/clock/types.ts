import { DeepReadonly } from "utility-types";

export type ClockState = DeepReadonly<{
  whiteTime: Time;
  blackTime: Time;
}>;

export interface Time {
  minutes: number;
  seconds: number;
}

export const ClockActionTypes = {
  RESET: "@@time/RESET",
  SET: "@@time/SET"
};
