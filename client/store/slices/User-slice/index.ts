import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  jid: string;
  hostUrl: string;
}

const initialState: User = {
  jid: "",
  hostUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.debug("changeUser", action.payload);
      state.jid = action.payload.jid;
      state.hostUrl = action.payload.hostUrl;
    },
    removeUser(state) {
      state.jid = "";
      state.hostUrl = "";
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
