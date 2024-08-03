import React from "react";
import { RootStack } from "../../../navigations/AppNavigator";
import LoginScreen from "../pages/Login";


export default () => (
  <RootStack.Group key="AuthGroup">
    <RootStack.Screen name="Login" component={LoginScreen}/>
  </RootStack.Group>
);
