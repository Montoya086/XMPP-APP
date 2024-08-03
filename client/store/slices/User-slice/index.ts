import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  userId: string;
  name: string;
}

const initialState: User = {
  userId: "",
  name: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.debug("changeUser", action.payload);
      state.userId = action.payload.userId;
      state.name = action.payload.name;
    },
    removeUser(state) {
      state.userId = "";
      state.name = "";
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
