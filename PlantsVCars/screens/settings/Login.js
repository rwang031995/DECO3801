import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, TextInputBase } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';


const LoginScreen = () => {
    return (
        <View style = {styles.container}>
            <Text style = {styles.category}>Username</Text>
            <TextInput style = {styles.input}
                placeholder='example@gmail.com'
            />
            <Text style = {styles.category}>Password</Text>
            <TextInput style = {styles.input}
                placeholder='password'
                secureTextEntry = {true}
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
    }
})

export default LoginScreen;
