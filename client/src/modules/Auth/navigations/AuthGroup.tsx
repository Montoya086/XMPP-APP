import React from "react";
import { RootStack } from "../../../navigations/AppNavigator";
import LoginScreen from "../pages/Login";
import SignUpScreen from "../pages/Signup";


export default () => (
  <RootStack.Group key="AuthGroup">
    <RootStack.Screen name="Login" component={LoginScreen}/>
    <RootStack.Screen name="Signup" component={SignUpScreen}/>
  </RootStack.Group>
);
