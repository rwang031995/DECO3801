import 'react-native-gesture-handler';
import { Navigation } from "react-native-navigation";
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

Navigation.events().registerAppLaunchedListener(() => {
  // Each time the event is received you should call Navigation.setRoot
});