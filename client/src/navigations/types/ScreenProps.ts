import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabsParamList, RootStackParamList } from "./RootParamList";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

/**
 * This intefaces can be used with the useRoute hook or React.FC for navigators direct child components.
 * We can create one interface for each navigator
 *
 * Example 1:
 * const { params } = useRoute<TopTabsScreenProps<'StorefrontCatalog'>>()
 *
 * Example 2:
 * const YourComponent: React.FC<TopTabsScreenProps<'StorefrontCatalog'>> = ({ route: { params } }) => { }
 */

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
export type BottomTabsProps<T extends keyof BottomTabsParamList> =
  BottomTabScreenProps<BottomTabsParamList, T>;
