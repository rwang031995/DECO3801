import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {img} from "./images/manifest";
import { createStackNavigator } from '@react-navigation/stack';
import PvCLeaderboard from './screens/Leaderboard';
import MyGardenNav from './screens/MyGarden'
import ChallengesScreen from './screens/Challenges';
import SettingsNav from "./screens/Settings";

const Tab = createBottomTabNavigator();

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
  
  biigLogo: {
    width: 200,
    height: 200,
  },

  flippy : {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
  },
  
  row : {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  bg : {
    width: '100%',
    height: '100%',
  }
})

var images = [
    {name: "Waves-in-Sea", style: styles.tinyLogo},
    {name: "Waves-in-Sea", style: styles.tinyLogo},
    {name: "Waves-in-Sea", style: styles.tinyLogo},
    {name: "Waves-in-Sea", style: styles.flippy},
    {name: "Waves-in-Sea", style: styles.biigLogo},
    {name: "Waves-in-Sea", style: styles.tinyLogo},
];

console.log(images[0])

var i0 = images[0]
var i1 = images[1]
var i2 = images[2]
var i3 = images[3]
var i4 = images[4]
var i5 = images[5]

i0.style = styles.biigLogo;

const OurForest = (images) => {
    return (
    <View style={styles.container}>
    <ImageBackground resizeMode="cover"
        blurRadius={20}
        source={require('./images/sub/Waves-in-Sea.jpg')}
        style={styles.bg}>
      <Text>This will be the suburb forest for multiplayer; currently showing off the fundamentals of a grid layout and background.</Text>
      <View style={styles.row}>
          {img(i0)}
          {img(i1)}
      </View>
      <View style={styles.row}>
          {img(i2)}
          {img(i3)}
      </View>
      <View style={styles.row}>
          {img(i4)}
          {img(i5)}
      </View>
    </ImageBackground>
    </View>
    );
}


const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route, }) => ({
          tabBarIcon: ({image}) => {
          if (route.name == 'My Garden') {
            image = require('./images/icons/MyGardenIcon.png')
          }
          if (route.name == 'Our Forest') {
            image = require('./images/icons/OurForestIcon.png')
          }
          if (route.name == 'Settings') {
            image = require('./images/icons/SettingsIcon.png')
          }          
          if (route.name == 'Challenges') {
            image = require('./images/icons/ChallengesIcon.png')
          }
          if (route.name == 'Leaderboard') {
            image = require('./images/icons/LeaderboardIcon.png')
          }
          return (
            <Image source={image} style={{width: 50, height:50}}/>
          )}
          })
        }>
        <Tab.Screen name="My Garden" component={MyGardenNav} />
        <Tab.Screen name="Our Forest" component={OurForest} />
        <Tab.Screen name="Settings" component={SettingsNav} />        
        <Tab.Screen name={"Challenges"} component={ChallengesScreen} />
        <Tab.Screen name="Leaderboard" component={PvCLeaderboard} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;