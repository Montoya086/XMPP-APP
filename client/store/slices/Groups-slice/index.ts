import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface Group{
    jid: string;
}

interface UserGroups {
    users:{
        [key: string]: Group[];
    }
}

const initialState: UserGroups = {
    users: {}
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    registerUserGroups: (state, action: PayloadAction<string>) => {
        if (!state.users[action.payload]) {
            state.users[action.payload] = [];
        }
    },
    addGroup: (state, action: PayloadAction<{ user: string; group: Group }>) => {
        if (!state.users[action.payload.user]){
            state.users[action.payload.user] = [];
        }
        // check if group already exists
        if (!state.users[action.payload.user].find(group => group.jid === action.payload.group.jid)){
            state.users[action.payload.user].push(action.payload.group);
        }
    },
    removeGroup: (state, action: PayloadAction<{ user: string; group: Group }>) => {
        if (state.users[action.payload.user]){
            state.users[action.payload.user] = state.users[action.payload.user].filter(group => group.jid !== action.payload.group.jid);
        }
    },
  },
});

export const { registerUserGroups, addGroup, removeGroup } = groupsSlice.actions;