import 'react-native-gesture-handler';
import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import CatScreen from "./CatScreen.js";
import DogScreen from "./DogScreen.js";
import GardenScreen from "./GardenScreen.js";


const GardenNav = ({ navigation, route }) => {
  return (
    <Stack.Navigator>
    <Stack.Screen
      name="Garden"
      component={GardenScreen}
      options={{ headerShown: false }}
    />
    
    <Stack.Screen
      name="Cats"
      component={CatScreen}
      options={{ headerShown: false }}
    />
    
    <Stack.Screen
      name="Dogs"
      component={DogScreen}
      options={{ headerShown: false }}
    />
    </Stack.Navigator>
  );
}

export default GardenNav;