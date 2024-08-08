import React, { useCallback, useMemo } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/RootParamList";
import { AppNavigationState, useAppSelector } from "@store/";
import { AppLoader } from "@components/";
import AuthGroup from "../../modules/Auth/navigations/AuthGroup";
import ChatGroup from "../../modules/Chat/navigations/ChatGroup";
// import InformationGroup from '../../modules/Information/navigations/InformationGroup'

interface RootStackScreenProps {
  appState: AppNavigationState;
}

export const RootStack = createNativeStackNavigator<RootStackParamList>();
const RootStackScreen: React.FC<RootStackScreenProps> = ({ appState }) => {
  console.debug("[appNavigationState] >>> ", appState);

  const screenForAppState = useCallback((appStateValue: AppNavigationState) => {
    switch (appStateValue) {
      case "LOGGED_IN":
        return [ChatGroup()];
      case "NOT_LOGGED_IN":
        return [AuthGroup()];
      default:
        return [AuthGroup()];
    }
  }, []);

  const initialScreen = useMemo((): keyof RootStackParamList => {
    switch (appState) {
      case "LOGGED_IN":
        return "Login";
      case "NOT_LOGGED_IN":
        return "Login";
      default:
        return "Login";
    }
  }, [appState]);

  return (
    <RootStack.Navigator
      initialRouteName={initialScreen}
      screenOptions={{
        presentation: "card",
        headerShown: false,
        headerBackVisible: false,
        orientation: "portrait_up",
      }}
    >
      {screenForAppState(appState)}
    </RootStack.Navigator>
  );
};

const RootStackScreenMemo = React.memo(
  RootStackScreen,
  (prevProps, nextProps) => {
    return prevProps.appState === nextProps.appState;
  }
);

const AppNavigator: React.FC = () => {
  const appState = useAppSelector((state) => state.appState.appNavigationState);
  const isLoading = useAppSelector((state) => state.loading.isLoading);
  console.debug("isLoading", isLoading);
  const navigationRef = useNavigationContainerRef();

  return (
    <AppLoader
      loading={isLoading}
      lottieSource={require("../../assets/lottie/loading.json")}
    >
    <NavigationContainer ref={navigationRef}>
      <RootStackScreenMemo appState={appState} />
    </NavigationContainer>
    </AppLoader>
  );
};

export default AppNavigator;
