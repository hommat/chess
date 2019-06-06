export interface IInputState {
  isPressing: boolean;
  position: IPosition;
}

interface IPosition {
  row: number;
  col: number;
}

interface IStartPressingAction {
  type: string;
  payload: {
    isPressing: boolean;
    position: IPosition;
  };
}

interface IStopPressingAction {
  type: string;
  payload: {
    isPressing: boolean;
    position: IPosition;
  };
}

interface ISetPositionAction {
  type: string;
  payload: {
    position: IPosition;
  };
}

export type InputActionTypes =
  | IStartPressingAction
  | IStopPressingAction
  | ISetPositionAction;
