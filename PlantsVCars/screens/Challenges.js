import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChallengeOptions = [
    {challenge : "Walk to X once this Week", completed : false}, 
    {challenge : "Run to X once this Week", completed : false}, 
    {challenge : "Take a bus once this week", completed : false}, 
    {challenge : "Take the train once this week", completed : false}, 
    {challenge : "This is a test example", completed : false}, 
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
            let ourLevel = await AsyncStorage.getItem("MyLevel");
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
        return moment().clone().startOf('isoWeek').add(3, 'days');
    }

    /**
     * save globally stored week. 
     */
    const saveWeek = async() => {
        try {
            await AsyncStorage.setItem("currentWeek", JSON.stringify(currentWeek()));
        } catch (err) {
                console.log("save week error");
        }
    }
    
    /**
     * load globally stored week. 
     */
    const loadWeek = async() => {
        try {
            let week = await AsyncStorage.getItem("currentWeek");
            if (week != null) {
                changeWeek(JSON.parse(week));
            }
        } catch (err) {
            console.log("load week error");
            
        }
    }

    /**
     * #FIXME, It rolls over but it repeatedly calls itself until storedWeek changes. 
     */
        const updateWeek = () => {
            if (moment().clone().subtract(7, 'days').isSameOrAfter(storedWeek)) {
                changeWeek(currentWeek());
                generateChallenges();
                console.log("hello");
            }
        }

        const saveItems = () => {
            saveWeek();
            saveChallenges();
        }

    //--------------------------------------------------------------------------------

    /**
     * Code for generating, storying and loading challenges.
     */

    /**
     * generate challenges from a pool. 
     */

    const generateChallenges = () => {
        const selectableChallenges = ChallengeOptions.slice();
        const challengeList = [];
        var n = 4;
        while (n > 0) {
            var value = Math.floor(Math.random() * selectableChallenges.length);
            challengeList.push(selectableChallenges[value]);
            selectableChallenges.splice(value, 1);
            n = n - 1;
        }
        setChallenges(challengeList);
    }

    /**
     * save globally stored week. 
     */
    const saveChallenges = async() => {
        try {
            await AsyncStorage.setItem("weeklyChallenge", JSON.stringify(challenges));
        } catch (err) {
                    console.log("save challenges error");
        }
    }
        
    /**
     * load globally stored week. 
     */
    const loadChallenges = async() => {
        try {
            let weeklyChallenges = await AsyncStorage.getItem("weeklyChallenge");
            if (weeklyChallenges != null) {
                setChallenges(JSON.parse(weeklyChallenges));
            }
        } catch (err) {
            console.log("load challenges error");
        }
    }

    //--------------------------------------------------------------------------------

    /**
     * Variables for global storage using Async.
     */
    const [level, setLevel] = useState(1);
    const [chalComplete, setChalCompleted] = useState(false);
    const [challenges, setChallenges] = useState([    
        {challenge : "Walk to X once this Week", completed : false}, 
        {challenge : "Run to X once this Week", completed : false}, 
        {challenge : "Take a bus once this week", completed : false}, 
        {challenge : "Take the train once this week", completed : false}
    ]);
    const [storedWeek, changeWeek] = useState(currentWeek());



    //--------------------------------------------------------------------------------

    /**
     * Load all the globally stored data upon opening page upon entering page.
     */
     useEffect(() => {
        loadLevel();
        loadWeek();
        loadChallenges();
        const interval = setInterval(() => {
            updateWeek();
            saveItems();
        }, 10000)
    }, []);

    /**
     * View screen
     */
    if (level == 1) {
        return (
            <View style={styles.container}>
                <Text style={styles.level}> Level {level}</Text>
                <Button title="Level test" onPress = {() => {levelTo(2)}}/>
                <Button title="generate challenges" onPress = {() => {generateChallenges()}}/>
                <Text> Challenge 1: {JSON.stringify(challenges[0].challenge).substring(1,JSON.stringify(challenges[0].challenge).length - 1)}</Text>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        return (
            <View style={styles.container}>
                <Text style={styles.level}> Level {level}</Text>
                <Text style={styles.headings}> Challenges </Text>
                <Button title="Level test" onPress = {() => {levelTo(1)}}/>
                <Button title="generate challenges" onPress = {() => {generateChallenges()}}/>
                <Button title="save challenges" onPress = {() => {saveChallenges()}}/>
                <View style={styles.breakline}></View> 
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}> {JSON.stringify(challenges[0].challenge).substring(1,JSON.stringify(challenges[0].challenge).length - 1)}</Text>
                    <Text style={styles.challengeText}> status: {JSON.stringify(challenges[0].completed)}</Text>
                </View>
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}> {JSON.stringify(challenges[1].challenge).substring(1,JSON.stringify(challenges[1].challenge).length - 1)}</Text>
                </View>

                <Text style={styles.headings}> Bonus Challenges </Text>
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
      backgroundColor: 'lightblue',
      textAlign: 'right',
      alignItems: 'center', 
    },
    level: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headings: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    challenges: {
        fontSize: 15,
    },
    challengeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
    },
    challengeText: {
        fontSize: 20,
        paddingTop: 15,
        paddingBottom: 15,
    },
    breakline: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: '100%',
    }
})

export default ChallengesScreen;
