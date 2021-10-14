import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import React, {useState} from "react";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {firebase} from "../settings/Firebase"

// export const LoginPage = () => {
//
//   /**
//    * Login with email & password.
//    */
//   const [initializing, setInitializing] = useState(true);
//   const [userEmail, setUserEmail] = useState(null);
//   const [user, setUser] = useState(null);
//   const [password, setPassword] = useState(null);
//
//   const onAuthStateChanged = (user) => {
//     setUser(user);
//     if (initializing) {
//       setInitializing(false);
//     }
//   }
//
//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber
//   }, [])
//
//   if (initializing) {
//     return null;
//   }
//
//   const onRegisterPress = () => {
//     // if (password !== confirmPass)
//   }
//
//   const signIn = (email, password) => {
//     auth().signInWithEmailAndPassword(email, password)
//       .then(() => {
//         console.log('logged in');
//       })
//       .catch(error => {
//         if (error.code === 'auth/user-not-found') {
//           alert("User not found");
//         }
//         if (error.code === 'auth/invalid-email') {
//           alert("Email is incorrect");
//         }
//         if (error.code === 'auth/wrong-password') {
//           alert("Incorrect password");
//         }
//         if (error.code === 'auth/user-disabled') {
//           alert("User has been disabled");
//         }
//         console.log(error);
//       })
//   }
//
//   const createUser = (email, password) => {
//     auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(() => {
//         console.log('User account has been created & signed in!')
//       })
//       .catch(error => {
//         if (error.code === 'auth/email-already-in-use') {
//           console.log("email already in use");
//           alert("This email already has an account");
//         }
//         if (error.code === 'auth/weak-password') {
//           alert("password is too weak");
//         }
//         if (error.code === 'auth/invalid-email') {
//           console.log("email invalid");
//           alert("Invalid email");
//         }
//         console.log(error);
//       })
//
//     return UsersRef.doc()
//   }
//
//   // auth.signOut()
//   // .then(() => console.log('User signed out!'));
//
//   return (
//     <View style={styles.container}>
//       <Text style={styles.category}>Username</Text>
//       <TextInput
//         style={styles.input}
//         placeholder='example@gmail.com'
//         onChangeText={text => setUserEmail(text)}
//         autoCapitalize="none"
//         autoCompleteType="off"
//         autoCorrect={false}
//       />
//       <Text style={styles.category}>Password</Text>
//       <TextInput
//         style={styles.input}
//         placeholder='password'
//         secureTextEntry={true}
//         onChangeText={text => setPassword(text)}
//         autoCapitalize={"none"}
//         autoCompleteType={"off"}
//         autoCorrect={false}
//       />
//       <Button
//         title="Login"
//         onPress={() => signIn(userEmail, password)}
//       />
//       <Button
//         title="Create Account"
//         onPress={() => createUser(userEmail, password)}
//       />
//     </View>
//   )
// }

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
            navigation.navigate('Home', {user})
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
    },
    button: {
      backgroundColor: '#788eec',
      marginLeft: 30,
      marginRight: 30,
      marginTop: 20,
      height: 48,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: 'center'
    },
    buttonTitle: {
      color: 'white',
      fontSize: 16,
      fontWeight: "bold"
    },
    footerView: {
      flex: 1,
      alignItems: "center",
      marginTop: 20
    },
    footerText: {
      fontSize: 16,
      color: '#2e2e2d'
    },
    footerLink: {
      color: "#788eec",
      fontWeight: "bold",
      fontSize: 16
    }
  }
)