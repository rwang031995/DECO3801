import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChallengeOptions = [
    {"challenge" : "Challenge 1", "completed" : false}, 
    {"challenge" : "Challenge 2", "completed" : false}, 
    {"challenge" : "Challenge 3", "completed" : false}, 
    {"challenge" : "Challenge 4", "completed" : false}, 
    {"challenge" : "Challenge 5", "completed" : false}, 
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

    const clearChallenges = () => {
        setChallenges([]);
    }

    const generateChallenges = (n) => {
        const selectableChallenges = ChallengeOptions.slice();
        while (n > 0) {
            var value = Math.floor(Math.random() * selectableChallenges.length);
            setChallenges([...challenges, {
                text: "12345",
                isComplete: false
            }])
            selectableChallenges.splice(value, 1);
            n = n - 1;
        }
    }

    const printChallenges = () => {
        console.log(challenges);
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
        generateChallenges();
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
                <Button title="clear challenges" onPress = {() => {clearChallenges()}}/>
                <Button title="generate challenges" onPress = {() => {generateChallenges(1)}}/>
                <Button title="print challenges" onPress = {() => {printChallenges()}}/>

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
                <Button title="clear challenges" onPress = {() => {clearChallenges()}}/>
                <Button title="generate challenges" onPress = {() => {generateChallenges(2)}}/>
                <Button title="print challenges" onPress = {() => {printChallenges()}}/>

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
