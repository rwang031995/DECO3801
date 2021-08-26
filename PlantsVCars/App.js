import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PvCLeaderboard from "./screens/Leaderboard";
import PvCMyGardenNav from "./screens/garden/MyGarden";

const Tab = createBottomTabNavigator();
const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)] // getMonth returns month from 0 - 11

const OurForest = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the suburb forest for multiplayer.</Text>
    </View>
  );
}

const Challenges = () => {
    return (
        <View style={styles.container}>
            <Text>This will be the Challenges screen</Text>
        </View>
    )
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="My Garden" component={PvCMyGardenNav} />
        <Tab.Screen name="Our Forest" component={OurForest} />
        <Tab.Screen name="Challenges" component={Challenges} />
        <Tab.Screen name="Leaderboard" component={PvCLeaderboard} />
      </Tab.Navigator>
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