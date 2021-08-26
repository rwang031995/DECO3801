import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import moment from 'moment';

const ChallengeOptions = ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5"]

const ChallengesScreen = () => {
    const [level, setLevel] = useState(1);
    const [challenges, isComplete] = useState(false);
    const selectedChallenges = [];
    const [currentWeek, changeWeek] = useState(moment().clone().startOf('isoWeek').add(1, 'days'));

    //Generates a random number that is used to random select challenges from a pool.
    const generateNumber = () => {
        var value = Math.floor(Math.random() * ChallengeOptions.length);
        return value;
    };

    const levelTo = (x) => {
        setLevel(x);
    }

    const nextWeek = () => {
        return moment().isSameOrAfter(currentWeek.add(7, 'days'));
    }

    if (level == 1) {
        selectedChallenges.push(ChallengeOptions[generateNumber()]);
        console.log(selectedChallenges[0]);
        console.log(nextWeek());
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Text> Challenges</Text>
                <Text> Challenge 1 = {selectedChallenges[0]}</Text>
                <Button title="Level test" onPress = {() => {levelTo(2)}}/>
                <Button title="Random generator" onPress = {() => {levelTo(1)}}/>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        selectedChallenges.push(ChallengeOptions[generateNumber()]);
        selectedChallenges.push(ChallengeOptions[generateNumber()]);
        console.log(selectedChallenges);
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Text> Challenges </Text>
                <Text> Challenge 1 = {selectedChallenges[0]}</Text>
                <Text> Challenge 2 = {selectedChallenges[1]}</Text>
                <Button title="Level test" onPress = {() => {levelTo(1)}}/>
                <Button title="Random generator" onPress = {() => {levelTo(1)}}/>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 3) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Text> Challenges </Text>
                <Text> Bonus Challenges </Text>
            </View>
        )
    } 
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: 'right',
      alignItems: 'center', 
    }
})

export default ChallengesScreen;
