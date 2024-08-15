import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GroupMessage{
    message: string;
    from: string;
    uid: string;
}

export interface GroupChat {
    with: string;
    messages: GroupMessage[];
    name?: string
    nonRead?: number;
}

export interface User_GroupChat {
    jid: string;
    chats: {
        [key: string]: GroupChat;
    };
}

export interface GroupsDatabase {
    users: {
        [key: string]: User_GroupChat;
    };
}

const initialState: GroupsDatabase = {
    users: {}
};

export const GroupsDatabaseSlice = createSlice({
  name: "groupsDatabase",
  initialState,
  reducers: {
    registerUserGroup: (state, action: PayloadAction<string>) => {
      if (!state.users[action.payload]) {
        state.users[action.payload] = { jid: action.payload, chats: {} };
      }
    },
    addMessageGroup: (state, action: PayloadAction<{ user: string; with: string; message: GroupMessage; name: string }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]) {
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [], nonRead: 0, name: action.payload.name };
      }
      state.users[action.payload.user].chats[action.payload.with].messages.push(action.payload.message);
    },
    addChatGroup: (state, action: PayloadAction<{ user: string; with: string; name: string }>) => {
      if (!state.users[action.payload.user].chats[action.payload.with]) {
        state.users[action.payload.user].chats[action.payload.with] = { with: action.payload.with, messages: [], nonRead: 0, name: action.payload.name };
      }
    },
    clearChatsGroup: (state, action: PayloadAction<string>) => {
      state.users[action.payload].chats = {};
    },
    incrementNonReadGroup: (state, action: PayloadAction<{ user: string; with: string }>) => {
      state.users[action.payload.user].chats[action.payload.with].nonRead = (state.users[action.payload.user].chats[action.payload.with].nonRead || 0) + 1;
    },
    resetNonReadGroup: (state, action: PayloadAction<{ user: string; with: string }>) => {
      state.users[action.payload.user].chats[action.payload.with].nonRead = 0;
    }
  },
});

export const { registerUserGroup, addMessageGroup, clearChatsGroup, addChatGroup, incrementNonReadGroup, resetNonReadGroup } = GroupsDatabaseSlice.actions;
