import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Message{
    message: string;
    from: string;
    uid: string;
}

export interface Chat {
    with: string;
    messages: Message[];
}

export interface User_Chat {
    jid: string;
    chats: {
        [key: string]: Chat;
    };
}

export interface Database {
    users: {
        [key: string]: User_Chat;
    };
}

const initialState: Database = {
    users: {}
};

export const databaseSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<string>) => {
      if (!state.users[action.payload]) {
        state.users[action.payload] = { jid: action.payload, chats: {} };
      }
    },
    addMessage: (state, action: PayloadAction<{ user: string; with: string; message: Message }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]) {
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [] };
      }
      state.users[action.payload.user].chats[action.payload.with].messages.push(action.payload.message);
    },
    addChat: (state, action: PayloadAction<{ user: string; with: string; }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]) {
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [] };
      }
    },
    clearChats: (state, action: PayloadAction<string>) => {
      state.users[action.payload].chats = {};
    }
  },
});

export const { registerUser, addMessage, clearChats, addChat } = databaseSlice.actions;
