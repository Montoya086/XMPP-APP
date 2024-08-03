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
import { userSlice } from "../slices";

const appPersistConfig = {
  key: "appState",
  storage: AsyncStorage,
};

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
};

AppStateListener();

type AppState = ReturnType<typeof appStateSlice.reducer>;
type UserState = ReturnType<typeof userSlice.reducer>;

const rootReducer = combineReducers({
  appState: persistReducer<AppState>(appPersistConfig, appStateSlice.reducer),
  user: persistReducer<UserState>(userPersistConfig, userSlice.reducer),
  loading: loadingSlice.reducer,
  userSlice: userSlice.reducer,
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
