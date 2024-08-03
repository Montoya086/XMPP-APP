import { startAppListening } from "..";
import { changeAppState } from "../../slices";

export const AppStateListener = () => {
  startAppListening({
    actionCreator: changeAppState,
    effect: async (action, listenerApi) => {
      switch (action.payload.appNavigationState) {
        case "LOGGED_IN":
          // TODO - implement logic to load user data
          console.log("APP STATE LISTENER LOGGED_IN");
          // listenerApi.dispatch(
          //   loadUser({
          //     avatar: action.payload.avatar,
          //     counters: action.payload.counters,
          //     guid: action.payload.guid,
          //     petpassRole: action.payload.petpassRole,
          //     role: action.payload.role,
          //     status: action.payload.status,
          //     userName: action.payload.userName,
          //     favVetGUID: action.payload.favVetGUID,
          //     // eslint-disable-next-line prettier/prettier
          //   })
          // );
          return;
        case "NOT_LOGGED_IN":
          // TODO - implement logic to reset user state
          console.log("APP STATE LISTENER NOT_LOGGED_IN");
        // listenerApi.dispatch(resetUserState());
      }
    },
  });
};
