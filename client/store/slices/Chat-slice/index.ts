import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    jid: "",
    type: "",
    name: ""
  },
  reducers: {
    setCurrentChat(state, action: PayloadAction<{
      jid: string;
      type?: "single" | "group";
      name?: string
    }>) {
      state.jid = action.payload.jid;
      state.type = action.payload.type || "single";
      state.name = action.payload.name || action.payload.jid
    },
  },
});

export const { setCurrentChat } = chatSlice.actions;
