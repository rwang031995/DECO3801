import {Image, ImageBackground, StyleSheet, Text, View} from "react-native";
import MyGardenNav from "../garden/MyGarden";
import ChallengesScreen from "../challenges/Challenges";
import PvCLeaderboard from "../leadboard/Leaderboard";
import SettingsNav from "../settings/Settings";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import React, {useEffect} from "react";
import {img} from "../../images/manifest";
import {firebase} from "../settings/Firebase"
import JourneyScreen from '../journey/MakeJourney'
import { Audio } from 'expo-av';


const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
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

  flippy: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  input: {
    fontSize: 20,
    width: '60%',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  category: {
    fontSize: 30,
    paddingVertical: 15,
  },
})

/*
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
                       source={require('../../images/sub/Waves-in-Sea.jpg')}
                       style={styles.bg}>
        <Text>This will be the suburb forest for multiplayer; currently showing
          off the fundamentals of a grid layout and background.</Text>
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
*/

export const HomeScreen = (props) => {

  const user = props.extraData
  // const userID = props.extraData.id
  // console.log(props.extraData.id)

  const [sound, setSound] = React.useState();

  async function playSound() {
    if (sound == undefined){
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
         require('../../assets/KawaiKitsuneLoop.mp3')
      );
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    }
  }

  return (
    <Tab.Navigator
      onReady={playSound()}
      screenOptions={({route,}) => ({
        tabBarIcon: ({image}) => {
          if (route.name === 'My Garden') {
            image = require('../../images/icons/MyGardenIcon.png')
          }
          if (route.name === 'Journey') {
            image = require('../../images/icons/WalkingIcon.png')
          }
          if (route.name === 'Settings') {
            image = require('../../images/icons/SettingsIcon.png')
          }
          if (route.name === 'Challenges') {
            image = require('../../images/icons/ChallengesIcon.png')
          }
          if (route.name === 'Leaderboard') {
            image = require('../../images/icons/LeaderboardIcon.png')
          }
          return (
            <Image source={image} style={{width: 50, height: 50}}/>
          )
        },
        tabBarActiveTintColor:'darkgreen',
      })
      }
      >
      <Tab.Screen name={"My Garden"} component={MyGardenNav}/>
      <Tab.Screen name={"Journey"} component={JourneyScreen}/>
      <Tab.Screen name={"Challenges"} component={ChallengesScreen}/>
      <Tab.Screen name={"Leaderboard"} component={PvCLeaderboard}/>
      <Tab.Screen name={"Settings"} component={SettingsNav}/>
    </Tab.Navigator>
  )
}