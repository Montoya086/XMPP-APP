export type BottomTabsParamList = {

};

export type RootStackParamList = {
  Login: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
