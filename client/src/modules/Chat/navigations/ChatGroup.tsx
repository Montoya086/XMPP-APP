import React from "react";
import { RootStack } from "../../../navigations/AppNavigator";
import ChatScreen from "../pages/ChatScreen";


export default () => (
  <RootStack.Group key="ChatGroup">
    <RootStack.Screen name="Chat" component={ChatScreen}/>
  </RootStack.Group>
);
