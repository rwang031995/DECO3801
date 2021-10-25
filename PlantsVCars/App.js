import React, {useEffect, useState} from 'react';
import {ImageBackground, LogBox, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {img} from "./images/manifest";
import {LoginPage} from "./screens/login/Login";
import {createStackNavigator} from "@react-navigation/stack";
import {RegistrationScreen} from "./screens/login/Registration";
import {HomeScreen} from "./screens/home/Home";
import {firebase} from "./screens/settings/Firebase"
import userId from './screens/home/userId';
import * as Font from 'expo-font';
import * as Geography from "./screens/journey/Geography";


const Stack = createStackNavigator()



const App = () => {

  /*
  Code adapted from Code adapted from
   https://www.freecodecamp.org/news/react-native-firebase-tutorial/
  */

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((doc) => {
            setUser(doc.data())
            setLoading(false)
            if (doc.data().suburb === false) {
              setModalVisible(true)
            }
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  
    (async () => {
      await Geography.prepareDatabase();
      await Geography.prepareBusStops();
      await Geography.prepareTrainStations();
    })();

  }, []);

  let [fontsLoaded] = Font.useFonts({
    'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf')
  });

  if (loading || !fontsLoaded) {
    return(
      <></>
    )
  }

  LogBox.ignoreLogs(["Setting a timer"])

  if (user == null) {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'} screenOptions ={{headerShown: false}}>
            <Stack.Screen name={"Home"} component={HomeScreen}/>
            <Stack.Screen name={"Login"} component={LoginPage}/>
            <Stack.Screen name={"Registration"} component={RegistrationScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
  } else {
    return (
      <userId.Provider value={user.id}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'} screenOptions ={{headerShown: false}}>
            <Stack.Screen name={"Home"}>
              {props => <HomeScreen {...props} extraData={user}/>}
            </Stack.Screen>
            <Stack.Screen name={"Login"} component={LoginPage}/>
            <Stack.Screen name={"Registration"} component={RegistrationScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </userId.Provider>
    )
  }
}

export default App;