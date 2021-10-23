import React, {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view"
import {StyleSheet, TextInput, TouchableOpacity, ImageBackground} from "react-native";
import {Text, View} from "react-native";
import {img} from "../../images/manifest"
import {firebase} from "../settings/Firebase";

/***
 * Code adapted from https://www.freecodecamp.org/news/react-native-firebase-tutorial/
 */

export const RegistrationScreen = ({navigation}) => {
  const isCompleted = ["cross", "tick"]
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onFooterLinkPress = () => {
    navigation.navigate("Login")
  }

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.")
      return
    }
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const data = {
          id: uid,
          email,
          currency: 100,
          flowers: [
            {name: "DandelionFlower", health: 0},
            {name: "RoseFlower", health: 0},
            {name: "OrchidFlower", health:0},
            {name: "RoseFlower", health: 0},
            {name: "OrchidFlower", health: 0},
            {name: "TulipFlower", health: 0}
          ],
          level: 1,
          challenges: [
            {challenge: "Walk to work once this Week", completed: isCompleted[0], mode: "walk"},
            {challenge: "Take the bus to work once this week", completed: isCompleted[0], mode: "bus"},
            {challenge: "Take the train once this week", completed: isCompleted[0], mode: "train"},
            {challenge: "Ride a bike to work once this week", completed: isCompleted[0], mode: "bike"},
            {challenge: "Ride a scooter to work once this week", completed: isCompleted[0], mode: "scooter"},
          ],
          bonusChallenge: false,
          currentWeek: "2021-09-06T14:00:00.000Z",
          settings: {
            hasBicycle: false,
            hasBus: false,
            hasScooter: false,
            hasTrain: false
          },
        };
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
          })
          .catch((error) => {
            alert(error)
          });

          navigation.navigate('Home', {user: data})
      })
      .catch((error) => {
        alert(error)
      });
  }

  return (
    <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}> 
      <View style={styles.logocontainer}>
        {img({name: 'logo', style: styles.logo})}
      </View>
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.keyboardView}>
          <TextInput
            style={styles.input}
            placeholder={"Email"}
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder='Confirm Password'
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => onRegisterPress()}>
            <Text style={styles.buttonTitle}>
              Create Account
            </Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Already got an account? <Text> </Text>
              <Text onPress={() => onFooterLinkPress()} style={styles.footerLink}>
                Log in
              </Text>
            </Text>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: '20%'
    },
    keyboardView: {
      flex: 1,
      width: "100%"
    },
    input: {
      height: 48,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: 'white',
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 30,
      marginRight: 30,
      paddingLeft: 16
    },logocontainer: {
      position: 'absolute',
      top: 270,
      left: 0,
      right: 0,
      bottom: 0,
    },
    logo: {
      width: '100%',
      resizeMode: 'contain'
    },
    button: {
      backgroundColor: 'darkgreen',
      marginLeft: 30,
      marginRight: 30,
      marginTop: 20,
      height: 48,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: 'center'
    },
    buttonTitle: {
      fontFamily: 'PressStart2P',
      color: 'darkorange',
      fontSize: 18,
      fontWeight: "bold"
    },
    footerView: {
      flex: 1,
      alignItems: "center",
      marginTop: 20
    },
    footerText: {
      fontFamily: 'PressStart2P',
      width: '80%',
      fontSize: 18,
      color: 'darkgreen'
    },
    footerLink: {
      color: "darkorange",
      fontWeight: "bold",
      fontSize: 16
    }
  }
)