import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    jid: "",
    type: "",
  },
  reducers: {
    setCurrentChat(state, action: PayloadAction<{
      jid: string;
      type?: "single" | "group";
    }>) {
      state.jid = action.payload.jid;
      state.type = action.payload.type || "single";
    },
  },
});

export const { setCurrentChat } = chatSlice.actions;
