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
    status?: "online" | "away" | "xa" | "dnd" | "offline" ;
    statusMessage?: string 
    nonRead?: number;
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
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [], status: "offline", nonRead: 0 };
      }
      state.users[action.payload.user].chats[action.payload.with].messages.push(action.payload.message);
    },
    addChat: (state, action: PayloadAction<{ user: string; with: string; }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]) {
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [], status: "offline", nonRead: 0 };
      }
    },
    clearChats: (state, action: PayloadAction<string>) => {
      state.users[action.payload].chats = {};
    },
    changeStatus: (state, action: PayloadAction<{ user: string; with: string; status: "online" | "away" | "xa" | "dnd" | "offline" }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]){
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [], status: "offline", nonRead: 0 };
      }
      state.users[action.payload.user].chats[action.payload.with].status = action.payload.status;
    },
    setStatusMessage: (state, action: PayloadAction<{ user: string; with: string; statusMessage: string}>) => {
      state.users[action.payload.user].chats[action.payload.with].statusMessage = action.payload.statusMessage;
    },
    incrementNonRead: (state, action: PayloadAction<{ user: string; with: string }>) => {
      state.users[action.payload.user].chats[action.payload.with].nonRead = (state.users[action.payload.user].chats[action.payload.with].nonRead || 0) + 1;
    },
    resetNonRead: (state, action: PayloadAction<{ user: string; with: string }>) => {
      state.users[action.payload.user].chats[action.payload.with].nonRead = 0;
    },
    deleteDatabaseAccount: (state, action: PayloadAction<string>) => {
      delete state.users[action.payload]
    },
  },
});

export const { registerUser, addMessage, clearChats, addChat, changeStatus, incrementNonRead, resetNonRead, deleteDatabaseAccount, setStatusMessage } = databaseSlice.actions;
