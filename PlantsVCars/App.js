// Use yarn install to add missing dependencies

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Garden" component={MyGarden} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
    </Tab.Navigator>
  );
}

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the home page :)</Text>
    </View>
  );
}

const MyGarden = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the "My Garden" page</Text>
    </View>
  )
}

const Leaderboard = () => {
    return (
      <View style={styles.container}>
        <Text>This will be a leaderboard</Text>
      </View>
    )
}

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabs/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})

export default App;