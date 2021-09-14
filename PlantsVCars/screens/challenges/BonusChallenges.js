import React, {useEffect, useState} from "react";
import {getSettings, setSetting, STORAGE_KEY} from "../settings/Storage";

import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

const BonusChallengesComponent = ({challenges}) => {

    return (
        <ScrollView>
            {challenges.map(({question, onPress}) => (
                <View key={question}>
                    <TouchableOpacity
                        onPress={onPress}
                        style={styles.touchableOpacity}>
                        <View style={styles.container}>
                            <Text style={styles.question}>
                                {question}
                            </Text>
                        </View>

                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    )
}

const BonusChallenges = ({navigation}) => {

    const challenges = [
        {
            question: "blah blah blah",
            onPress: () => {navigation.navigate(this.question)}
        },
        {
            question: "What is the average yearly C02 emission in Australia?",
            onPress: () => {navigation.navigate(this.question)}
        }

    ]

    return (
        <BonusChallengesComponent
            challenges={challenges}
        />
    )
}

const bonusChallengePool = [
    {
        challenge: "Blah Blah Blah",
        onPress: () => {}
    }
]

const styles = StyleSheet.create({
    question: {
        fontSize: 18
    },
    touchableOpacity: {
        flex: 1
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20
    }
})

export default BonusChallenges