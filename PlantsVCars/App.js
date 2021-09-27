import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {img} from "./images/manifest";
import { createStackNavigator } from '@react-navigation/stack';

import * as TaskManager from 'expo-task-manager';
import {Asset} from 'expo-asset';
import AppLoading from 'expo-app-loading';

import * as Location from 'expo-location';
import * as SQLite from 'expo-sqlite';
import * as FileSystem from "expo-file-system";

import * as Geography from './Geography';
import PvCLeaderboard from './screens/Leaderboard';
import MyGardenNav from './screens/garden/MyGarden'
import ChallengesScreen from './screens/Challenges';
import SettingsNav from "./screens/settings/Settings";



console.log("----- REFRESH -----"); // todo: remove me eventually
const Tab = createBottomTabNavigator();

// console.log(dbQuery(xxxx, "SELECT name FROM sqlite_master WHERE type IN ('table','view');", []));


const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  icon : {
    width: 20,
    height: 20,
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
      <Text>{}</Text>
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


const _App = () => {
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
        <Tab.Screen name={"Challenges"} component={ChallengesScreen} />
        <Tab.Screen name="Leaderboard" component={PvCLeaderboard} />
        <Tab.Screen name="Settings" component={SettingsNav} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// 23rd September: this is different now so that we can run prepareShapesDb
export default class App extends React.Component {
  state = {
    isReady: false,
    dbResult: null,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._runAsyncSetup}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      ); }
    
    const db = SQLite.openDatabase('shapes.db');

    // ok so this is presently an infinite loop, yikes
    if (this.state.dbResult == null){
        Geography.dbQuery(db, 
            "SELECT name FROM sqlite_master WHERE type IN ('table','view');", [],
            (t, r) => {this.setState({dbResult: r})}
        );
    }
    
    Geography.dbQuery(db, "SELECT count(*) FROM RouteShapes WHERE route = ?;", ['BRGY'], 
        (t, r) => {console.log(t, r)}); // should be 1621 as of September 2021 dataset
    
    console.log()
    
    return <_App />;
  }

  async _runAsyncSetup() {
    await Location.requestForegroundPermissionsAsync();
    await Location.requestBackgroundPermissionsAsync();
  
    return Promise.all([
        Geography.prepareShapesDb(require('./assets/shapesdb.sqlite')),
        Location.startLocationUpdatesAsync(Geography.LOCATION_UPDATES_TASK, 
            {accuracy: Location.LocationAccuracy.Balanced}),
        ]);
  }
}

//export default App;