import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AppNavigationState = "LOGGED_IN" | "NOT_LOGGED_IN";

export interface AppState {
  appNavigationState: AppNavigationState;
  isSignUp?: boolean;
}

const initialState: AppState = {
  appNavigationState: "NOT_LOGGED_IN",
};

export const appStateSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    changeAppState(state, action: PayloadAction<AppState>) {
      console.debug("changeAppState", action.payload);
      state.appNavigationState = action.payload.appNavigationState;
      state.isSignUp = action.payload.isSignUp;
    },
  },
});

export const { changeAppState } = appStateSlice.actions;
