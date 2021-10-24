import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground
} from "react-native";
import {img} from "../../images/manifest"
import React, {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {firebase} from "../settings/Firebase"

/***
 * Code adapted from https://www.freecodecamp.org/news/react-native-firebase-tutorial/
 */

export const LoginPage = ({navigation}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onFooterLinkPress = () => {
    navigation.navigate("Registration")
  }

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid
        const usersRef = firebase.firestore().collection('users')
        usersRef
          .doc(uid)
          .get()
          .then(firestoreDocument => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.")
              return;
            }
            const user = firestoreDocument.data()
            navigation.navigate('My Garden')
          })
          .catch(error => {
            alert(error)
          });
      })
      .catch(error => {
        alert(error)
      })
  }

  return (
    <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}> 
      <View style={styles.logocontainer}>
        {img({name: 'logo', style: styles.logo})}
      </View>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          style={styles.keyboardView}
          keyboardShouldPersistTaps={"always"}
        >
          <TextInput
            style={styles.input}
            placeholder='E-mail'
            placeholderTextColor="#aaaaaa"
            onChangeText={(text) => setEmail(text)}
            value={email}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry
            placeholder='Password'
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => onLoginPress()}>
            <Text style={styles.buttonTitle}>Log in</Text>
          </TouchableOpacity>
          <View style={styles.footerView}>
            <Text style={styles.footerText}>
              Don't have an account? <Text></Text>
              <Text
                style={styles.footerLink}
                onPress={onFooterLinkPress}>
                Sign up
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
      alignItems: "center"
    },
    keyboardView: {
      flex: 1,
      width: "100%",
      paddingTop: "20%"
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
      top: 200,
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