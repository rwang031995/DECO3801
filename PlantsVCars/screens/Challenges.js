import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChallengeOptions = [
    {challenge1 : "Challenge 1", completed1 : false}, 
    {challenge2 : "Challenge 2", completed2 : false}, 
    {challenge3 : "Challenge 3", completed3 : false}, 
    {challenge4 : "Challenge 4", completed4 : false}, 
    {challenge5 : "Challenge 5", completed5 : false}, 
    ];

const ChallengesScreen = () => {

    /**
     * Leveling system.
     */

    /**
     * save globally stored level. 
     */
    const saveLevel = async(x) => {
        try {
            await AsyncStorage.setItem("MyLevel", JSON.stringify(x));
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

    /**
     * Set current level to x and store into global.
     */

    const levelTo = (x) => {
        setLevel(x);
        saveLevel(x);
    }

    //--------------------------------------------------------------------------------

    /**
     * Code for current week and next week
     */

    /**
     * Gives the start of the week of the current time.
     */
    const currentWeek = () => {
        return moment().clone().startOf('isoWeek').add(1, 'days');
    }

    /**
     * save globally stored week. 
     */
     const saveWeek = async() => {
        try {
            await AsyncStorage.setItem("currentWeek", JSON.stringify(storedWeek));
        } catch (err) {
                console.log("save week error");
        }
    }
    
    /**
     * load globally stored week. 
     */
    const loadWeek = async() => {
        try {
            week = await AsyncStorage.getItem("currentWeek");
            if (week != null) {
                changeWeek(JSON.parse(week));
            }
        } catch (err) {
            console.log("load week error");
        }
    }

    //--------------------------------------------------------------------------------

    /**
     * Code for generating, storying and loading challenges.
     */

    /**
     * generate challenges from a pool. 
     */

    const addChallenges = (n) => {
        setChallenges([]);
        const selectableChallenges = ChallengeOptions.slice();
        while (n > 0) {
            var value = Math.floor(Math.random() * selectableChallenges.length);
            selectableChallenges.splice(value, 1);
            n = n - 1;
        }
    }

    //--------------------------------------------------------------------------------

    /**
     * Variables for global storage using Async.
     */
    const [level, setLevel] = useState(1);
    const [chalComplete, setChalCompleted] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [storedWeek, changeWeek] = useState(currentWeek());

    //--------------------------------------------------------------------------------

    /**
     * Load all the globally stored data upon opening page upon entering page.
     */
     useEffect(() => {
        loadLevel();
        loadWeek();
    }, []);

    /**
     * Do this when the app opens to generate new challenges for each week.
     */

    //#FIXME uses currentWeek().clone - should be using storedWeek.clone() but causes an error even though both uses moment.Moment obj.
    const followingWeek = currentWeek().clone().add(7, 'days');
    if (currentWeek().isSameOrAfter(followingWeek)) {
        //Code to refresh the weekly challenges.
        changeWeek(followingWeek);
        saveWeek();
    }

    /**
     * View screen
     */
    if (level == 1) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Button title="Level test" onPress = {() => {levelTo(2)}}/>
                <Text> currentWeek 1 {JSON.stringify(storedWeek)}</Text>
                <Button title="Week test" onPress = {() => {saveWeek()}}/>
                <Text> Challenge 1 {challenges[0]}</Text>
                <Button title="generate challenges" onPress = {() => {addChallenges(1)}}/>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Button title="Level test" onPress = {() => {levelTo(1)}}/>
                <Text> currentWeek 2 {JSON.stringify(storedWeek)}</Text>
                <Button title="Week test" onPress = {() => {saveWeek()}}/>
                <Text> Challenge 1 {challenges[0]}</Text>
                <Text> Challenge 2 {challenges[1]}</Text>
                <Button title="generate challenges" onPress = {() => {addChallenges(2)}}/>
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
