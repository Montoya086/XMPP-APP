import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AppStateListener, listenerMiddleware } from "../listenerMiddleware";
import { appStateSlice } from "../slices/AppState-slice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadingSlice } from "../slices/Loading-slice";
import { chatSlice, groupsSlice, notificationsSlice, userSlice } from "../slices";
import { databaseSlice } from "../slices/Database-slice";
import { GroupsDatabaseSlice } from "../slices/GroupsDatabase-slice";

const appPersistConfig = {
  key: "appState",
  storage: AsyncStorage,
};

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
};

const databasePersistConfig = {
  key: "database",
  storage: AsyncStorage
}

const notificationsPersistConfig = {
  key: "notifications",
  storage: AsyncStorage
}

const groupsPersistConfig = {
  key: "groups",
  storage: AsyncStorage
}

AppStateListener();

type AppState = ReturnType<typeof appStateSlice.reducer>;
type UserState = ReturnType<typeof userSlice.reducer>;
type DatabaseState = ReturnType<typeof databaseSlice.reducer>;
type NotificationsState = ReturnType<typeof notificationsSlice.reducer>
type GroupsState = ReturnType<typeof groupsSlice.reducer>

const rootReducer = combineReducers({
  appState: persistReducer<AppState>(appPersistConfig, appStateSlice.reducer),
  user: persistReducer<UserState>(userPersistConfig, userSlice.reducer),
  database: persistReducer<DatabaseState>(databasePersistConfig, databaseSlice.reducer),
  notificationsSlice: persistReducer<NotificationsState>(notificationsPersistConfig, notificationsSlice.reducer),
  groupsSlice: persistReducer<GroupsState>(groupsPersistConfig, groupsSlice.reducer),
  groupDatabase: GroupsDatabaseSlice.reducer,
  loading: loadingSlice.reducer,
  userSlice: userSlice.reducer,
  chatSlice: chatSlice.reducer,

});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type ReducerStates = {
  // auth: UserState;
};
