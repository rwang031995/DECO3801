import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

const ChallengeOptions = ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4", "Challenge 5"]

const ChallengesScreen = () => {
    const [level, setLevel] = useState(1);
    const [challenges, isComplete] = useState(false);
    const [randomNumber, setRandomNumber] = useState(0);
    const selectedChallenges = ["hi"];

    const generateNumber = () => {
        var value = Math.floor(Math.random() * ChallengeOptions.length);
        setRandomNumber(value);
    };

    if (level == 1) {
        console.log({randomNumber});
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Text> Challenges</Text>
                <Text> Challenge 1 = {randomNumber}</Text>
                <Button title = "Generate" onPress = {generateNumber} />
                <Text> Bonus Challenges </Text>
            </View>
        )
    } else if (level == 2) {
        return (
            <View style={styles.container}>
                <Text> Level {level}</Text>
                <Text> Challenges </Text>
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
