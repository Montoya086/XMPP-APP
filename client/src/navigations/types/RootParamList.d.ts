export type BottomTabsParamList = {

};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
