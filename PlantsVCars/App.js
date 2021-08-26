import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import PvCLeaderboard from './screens/Leaderboard';
import MyGardenNav from './screens/MyGarden'
import ChallengesScreen from './screens/Challenges';

const Tab = createBottomTabNavigator();

const OurForest = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the suburb forest for multiplayer.</Text>
    </View>
  );
}


const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="My Garden" component={MyGardenNav} />
        <Tab.Screen name="Our Forest" component={OurForest} />
        <Tab.Screen name={"Challenges"} component={ChallengesScreen} />
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