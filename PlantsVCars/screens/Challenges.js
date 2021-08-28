import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChallengeOptions = ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5"]

const ChallengesScreen = () => {
    /**
     * Variables for global storage using Async.
     */
    const [level, setLevel] = useState(1);
    const [challenges, isComplete] = useState(false);
    const selectedChallenges = [];
    const [currentWeek, changeWeek] = useState(moment().clone().startOf('isoWeek').add(1, 'days'));

    //--------------------------------------------------------------------------------

    /**
     * save globally stored level. 
     */
    const saveLevel = async(x) => {
        try {
            await AsyncStorage.setItem("MyLevel", JSON.stringify(x));
            console.log(x);
        } catch (err) {
            console.log("save level error");
        }
    }

    /**
     * load globally stored level. 
     */
    const loadLevel = async() => {
        try {
            ourLevel = await AsyncStorage.getItem("MyLevel");
            if (ourLevel != null) {
                setLevel(JSON.parse(ourLevel));
            }
        } catch (err) {
            console.log("load level error");
        }
    }

    //--------------------------------------------------------------------------------

    /**
     * save globally stored week. 
     */
     const saveWeek = async() => {
        try {
            await AsyncStorage.setItem("currentWeek", JSON.stringify(x));
            console.log(x);
        } catch (err) {
                console.log("save level error");
        }
    }
    
    /**
     * load globally stored week. 
     */
    const loadWeek = async() => {
        try {
            ourLevel = await AsyncStorage.getItem("MyLevel");
            if (ourLevel != null) {
                setLevel(JSON.parse(ourLevel));
            }
        } catch (err) {
            console.log("load level error");
        }
    }

    //--------------------------------------------------------------------------------

    /**
     * Code for generating, storying and loading challenges.
     */

    //Generates a random number that is used to random select challenges from a pool.
    const generateNumber = () => {
        var value = Math.floor(Math.random() * ChallengeOptions.length);
        return value;
    };

    const levelTo = (x) => {
        setLevel(x);
        saveLevel(x);
    }

    const nextWeek = () => {
        return moment().isSameOrAfter(currentWeek.add(7, 'days'));
    }

    //--------------------------------------------------------------------------------

    /**
     * Load all the globally stored data upon opening page.
     */
    useEffect(() => {
        loadLevel();
    }, []);

    //--------------------------------------------------------------------------------

    /**
     * View screen
     */

    if (level == 1) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Button title="Level test" onPress = {() => {levelTo(2)}}/>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Button title="Level test" onPress = {() => {levelTo(1)}}/>
                <Text> Bonus Challenges </Text>
            </View>
        )
    }
}

    //--------------------------------------------------------------------------------

    /**
     * Styling code
     */

const styles = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: 'right',
      alignItems: 'center', 
    }
})

export default ChallengesScreen;
