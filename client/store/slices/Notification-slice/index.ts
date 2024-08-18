import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface notification {
    from: string
    name: string
    roomJid: string
}

interface notifications {
    content: {
        [key: string]: notification[]
    }
}

const initialState: notifications = {
    content: {}
}


export const notificationsSlice = createSlice({
  name: "notifications",
  initialState: initialState,
  reducers: {
    addNotification(state, action: PayloadAction<{
      jid: string;
      from: string
      name: string
      roomJid: string
    }>) {
        if (!state.content[action.payload.jid]){
            state.content[action.payload.jid] = []
        }
        const exists = state.content[action.payload.jid].some(contact => contact.roomJid === action.payload.roomJid);
        if (!exists){
            state.content[action.payload.jid].push({
                from: action.payload.from,
                roomJid: action.payload.roomJid,
                name: action.payload.name 
            })
        }
    },
    removeNotification(state, action: PayloadAction<{
        index: number
        jid: string
    }>) {
        state.content[action.payload.jid].splice(action.payload.index, 1)
    },
  },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
