import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  jid: string;
  hostUrl: string;
  hostName: string;
  password: string;
}

const initialState: User = {
  jid: "",
  hostUrl: "",
  hostName: "",
  password: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.debug("changeUser", action.payload);
      state.jid = action.payload.jid;
      state.hostUrl = action.payload.hostUrl;
      state.hostName = action.payload.hostName;
      state.password = action.payload.password;
    },
    removeUser(state) {
      state.jid = "";
      state.hostUrl = "";
      state.hostName = "";
      state.password = "";
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
