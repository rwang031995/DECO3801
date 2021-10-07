import React, {useEffect, useState} from 'react';
import {ImageBackground, LogBox, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {img} from "./images/manifest";
import {LoginPage} from "./screens/login/login";
import {createStackNavigator} from "@react-navigation/stack";
import {RegistrationScreen} from "./screens/login/Registration";
import {HomeScreen} from "./screens/home/Home";
import {firebase} from "./screens/settings/Firebase"


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

const Stack = createStackNavigator()

const App = () => {

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const usersRef = firebase.firestore().collection('users');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setUser(userData)
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return(
      <></>
    )
  }

  LogBox.ignoreLogs(["Setting a timer"])

  // firebase.auth().signOut()

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'} screenOptions ={{headerShown: false}}>
        <Stack.Screen name={"Home"}>
          {props => <HomeScreen {...props} extraData={user}/>}
        </Stack.Screen>
        <Stack.Screen name={"Login"} component={LoginPage}/>
        <Stack.Screen name={"Registration"} component={RegistrationScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;