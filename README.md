# XMPP-APP Chat

This app is made for educative purposes only.
Using the XMPP protocol, this app is able to send and recive messages from other users and group chats.
You can access the presentation [here](https://www.canva.com/design/DAGPEpn9AJU/3TYa4OQs_Uhj_QtRFeju5A/edit?utm_content=DAGPEpn9AJU&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Features
### Account Management
- Register a new account on the XMPP server.
- Log in with an existing account.
- Log out from the current session.
- Delete the account from the server.
### Communication
- Display all contacts and their status.
- Add a user to your contacts list.
- View contact details for any user.
- 1-on-1 communication with any user/contact.
- Participate in group chats with multiple users.
- Set a presence message to show your current status.
- Send/receive notifications for various events.

## Dependencies
This app was developed in React Native using TypeScript with the following key dependencies:

* @react-native-async-storage/async-storage: For persistent storage of key-value pairs.
* @react-navigation/native and @react-navigation/bottom-tabs: For navigating between different screens in the app.
* @reduxjs/toolkit and react-redux: For managing global state with Redux.
* @xmpp/client and @xmpp/debug: For implementing XMPP protocol-based communication.
* formik and yup: For handling forms and validation.
* react-native-svg: For rendering SVG images in the app.
* react-native-toast-message: For displaying toast notifications.
* react-native-document-picker: For picking documents from the device storage.
* react-native-image-picker: For selecting images from the device gallery or camera.
* react-native-modal: For creating modals in the app.

### Development Dependencies
* @babel/core and @babel/preset-env: For transpiling modern JavaScript code to be compatible with older environments.
* eslint: For linting and maintaining code quality.
* jest: For running unit tests.
* typescript: For static typing in the project.

# Getting Started

>**Note**: Make sure to complete the [React Native - Environment Setup](https://reactnative.dev/docs/set-up-your-environment) instructions, before proceeding. This is necessary for launching react-native apps.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of the project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of the project. Run the following command to start the _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see the app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run the app — you can also run it directly from within Android Studio and Xcode respectively. This can be made by opening in the respective Android/IOS folder.
