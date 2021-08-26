import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {img, imgbg} from "./images/manifest";

const Tab = createBottomTabNavigator();
const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)] // getMonth returns month from 0 - 11

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
  }
  
})

var images = [
    {name: "Ben", style: styles.tinyLogo},
    {name: "Ben", style: styles.tinyLogo},
    {name: "Ben", style: styles.tinyLogo},
    {name: "Ben", style: styles.flippy},
    {name: "Ben", style: styles.biigLogo},
    {name: "Ben", style: styles.tinyLogo},
];

console.log(images[0])

// todo: load and position images

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
      <Text>This will be the suburb forest for multiplayer.</Text>
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
    </View>
    );
}



console.log(img(images[0]));


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

export default App;