import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import PvCLeaderboard from "./Components/PvCLeaderboard";
// import PvCMyGardenNav from "./Components/PvCMyGarden";
import img from "./images/manifest";

const Tab = createBottomTabNavigator();
const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)] // getMonth returns month from 0 - 11

const OurForest = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the suburb forest for multiplayer.</Text>
      {img({name: "Ben", style: styles.tinyLogo})}    
    </View>
  );
}

console.log(img({"name": "Ben"}));

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
        <Tab.Screen name="Our Forest" component={OurForest} />
        <Tab.Screen name="Challenges" component={Challenges} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
})

export default App;