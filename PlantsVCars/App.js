import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button, Image, ImageBackground} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {img} from "./images/manifest";
import { createStackNavigator } from '@react-navigation/stack';
import PvCLeaderboard from './screens/Leaderboard';
import MyGardenNav from './screens/garden/MyGarden'
import ChallengesScreen from './screens/Challenges';
import SettingsNav from "./screens/settings/Settings";
import { auth, database } from './screens/settings/Firebase';
import LoginScreen from './screens/settings/Login';

// Adding to real time database code.1

// database.ref('user/008').set(
//   {
//     name: "test",
//     age: 20
//   }
// ).then(() => {
//     console.log("INSERTED!");
//   }).catch((error) => {
//     console.log(error);
// })

const Tab = createBottomTabNavigator();

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
  
  /**
   * Login with email & password.
   */
  const [initializing, setInitializing] = useState(true);
  const[user, setUser] = useState();

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  if (initializing) {
    return null;
  }

  const createUser = (email, password) => {
    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account has been created & signed in!')
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log("email already in use");
      } 
      if (error.code === 'auth/invalid-email') {
        console.log("email invalid");
      }
      console.log(error);
    })
  }

  const logoff = () => {
    auth.signOut()
    .then(() => console.log('User signed out!'));
  }

  if (!user) {
    return (
      <LoginScreen></LoginScreen>
    )
  }

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

export default App;