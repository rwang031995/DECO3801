import React, { useState, useEffect, useContext} from 'react';
import { StyleSheet, View, Text, Button, TextInputBase } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { auth, database } from './Firebase';

const LoginScreen = () => {
    /**
   * Login with email & password.
   */
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState(null);
    
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

    const signIn = (email, password) => {
        auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('logged in');
        })
        .catch(error => {
            if (error.code === 'auth/user-not-found') {
                alert("User not found");
            }
            if (error.code === 'auth/invalid-email') {
                alert("Email is incorrect");
            }
            if (error.code === 'auth/wrong-password') {
                alert("Incorrect password");
            }
            if (error.code === 'auth/user-disabled') {
                alert("User has been disabled");
            }
            console.log(error);
        })
    }
    
    const createUser = (email, password) => {
        auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
        console.log('User account has been created & signed in!')
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log("email already in use");
                alert("This email already has an account");
            } 
            if (error.code === 'auth/invalid-email') {
                console.log("email invalid");
                alert("Invalid email");
            }
            console.log(error);
        })
    }
    
    const logoff = () => {
        auth.signOut()
        .then(() => console.log('User signed out!'));
    }
    return (
        <View style = {styles.container}>
            <Text style = {styles.category}>Username</Text>
            <TextInput style = {styles.input}
                placeholder='example@gmail.com'
                onChangeText = {text => setUser(text)}
                autoCapitalize = "none"
                autoCompleteType = "off"
                autoCorrect = {false}
            />
            <Text style = {styles.category}>Password</Text>
            <TextInput style = {styles.input}
                placeholder='password'
                secureTextEntry = {true}
                onChangeText = {text => setPassword(text)}
                autoCapitalize = {false}
                autoCompleteType = {false}
                autoCorrect = {false}
            />
            <Button
                title = "Login"
                onPress = {() => signIn(user, password)}
            />
            <Button
                title = "Create Account"
                onPress = {() => createUser(user, password)}
            />
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center'
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

export default LoginScreen;
