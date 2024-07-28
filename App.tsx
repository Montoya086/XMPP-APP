import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import { store as ReduxStore, persistor } from "./store";
import { lightTheme } from "@themes/";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { PersistGate } from "redux-persist/integration/react";
import { Host } from "react-native-portalize";
import AppConfiguration from "./src/AppCofiguration";
import Toast from "react-native-toast-message";


function App(): React.JSX.Element {

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={ReduxStore}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={lightTheme}>
            <Host>
              <AppConfiguration />
              <Toast />
            </Host>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
