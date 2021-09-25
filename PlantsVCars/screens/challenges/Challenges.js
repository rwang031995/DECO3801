import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {img} from "../../images/manifest"

const isCompleted = ["RoseFlower", "TulipFlower"]

const ChallengeOptions = [
    {challenge : "Walk to X once this Week", completed : isCompleted[0]}, 
    {challenge : "Run to X once this Week", completed : isCompleted[0]}, 
    {challenge : "Take a bus once this week", completed : isCompleted[0]}, 
    {challenge : "Take the train once this week", completed : isCompleted[0]}, 
    {challenge : "This is a test example", completed : isCompleted[0]}, 
    ];

const ChallengesScreen = () => {

    /**
     * Leveling system.
     */

    /**
     * save globally stored level. 
     */
    const saveLevel = async() => {
        try {
            await AsyncStorage.setItem("MyLevel", JSON.stringify(level));
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

    //--------------------------------------------------------------------------------

    /**
     * Code for current week and next week`127
     */

    /**
     * save globally stored week. 
     */
    const saveWeek = async() => {
        try {
            await AsyncStorage.setItem("currentWeek", storedWeek);
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
                changeWeek(week);
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
    const [level, setLevel] = useState(2);
    const [challenges, setChallenges] = useState([    
        {challenge : "Walk to X once this Week", completed : isCompleted[0]}, 
        {challenge : "Run to X once this Week", completed : isCompleted[0]}, 
        {challenge : "Take a bus once this week", completed : isCompleted[0]}, 
        {challenge : "Take the train once this week", completed : isCompleted[0]}
    ]);
    const [storedWeek, changeWeek] = useState("2021-09-06T14:00:00.000Z");

    //--------------------------------------------------------------------------------
    /**
     * Load all the globally stored data upon opening page upon entering page.
     */
    const updateWeeklyReset = () => {
        var currentWeek = moment().startOf('isoWeek').add(1,'days');
        var previousWeek = moment(storedWeek); 
        if (currentWeek.clone().subtract(7, 'days').isSameOrAfter(previousWeek)) {
            var newWeek = JSON.stringify(currentWeek).substring(1, JSON.stringify(currentWeek).length - 1)
            var challengesComplete = true;
            for (var i = 0; i < challenges.length; i++) {
                if (challenges[i].completed == isCompleted[0]) {
                    challengesComplete = false;
                } 
            }
            generateChallenges();
            if (challengesComplete && level < 4) {
                setLevel(level + 1);
            } else if (!challengesComplete && level > 1) {
                setLevel(level - 1);
            }
            changeWeek(newWeek);
        }
    }

    const saveWeeklyReset = () => {
        saveWeek();
        saveChallenges();
        saveLevel();
    }

    const increaseLevel = () => {
        setLevel(level + 1);
    }
    
    useEffect(() => {
        if (storedWeek === "2021-09-06T14:00:00.000Z") {
            loadLevel();
            loadWeek();
            loadChallenges();
        }
        const interval = setInterval(() => {
            updateWeeklyReset();
            saveWeeklyReset();
        }, 5000)
        return () => clearInterval(interval)
    }, [storedWeek]);

    /**
     * View screen
     */
    if (level == 1) {
        return (
            <View style={styles.container}>
                <Text style={styles.level}> Level {level}</Text>
                <Text style={styles.headings}> Challenges </Text>
                <Text style={styles.level}> storedWeek = {JSON.stringify(storedWeek)} </Text>
                <Button title="inc lvl" onPress = {() => {increaseLevel()}}/>
                <View style={styles.breakline}></View> 
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}> {JSON.stringify(challenges[0].challenge).substring(1,JSON.stringify(challenges[0].challenge).length - 1)}</Text>
                    {img({name: challenges[0].completed, style: styles.plantTile})}
                </View>

                <Text style={styles.headings}> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        return (
            <View style={styles.container}>
                <Text style={styles.level}> Level {level}</Text>
                <Text style={styles.headings}> Challenges </Text>
                <Text style={styles.level}> storedWeek = {JSON.stringify(storedWeek)} </Text>
                <Button title="save Level" onPress = {() => {saveLevel()}}/>
                <View style={styles.breakline}></View> 
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}> {JSON.stringify(challenges[0].challenge).substring(1,JSON.stringify(challenges[0].challenge).length - 1)}</Text>
                    {img({name: challenges[0].completed, style: styles.plantTile})}
                </View>
                <View style={styles.challengeContainer}>
                    <Text style={styles.challengeText}> {JSON.stringify(challenges[1].challenge).substring(1,JSON.stringify(challenges[1].challenge).length - 1)}</Text>
                    {img({name: challenges[0].completed, style: styles.plantTile})}
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
    }, plantTile: {
        height: "50%",
        width: "10%",
        margin: "4%"
    },
})

export default ChallengesScreen;
