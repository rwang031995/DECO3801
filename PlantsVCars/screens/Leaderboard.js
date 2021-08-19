import {Text, View, Alert} from "react-native";
import Leaderboard from "react-native-leaderboard";
import React, {Component, useState} from "react";

const PvCLeaderboard = () => {

    const [data, setData] = useState(DATA)

    alert = (title, body) => {
        Alert.alert(title, body, [{ text: "OK", onPress: () => {} }], {
            cancelable: false
        });
    };

    const props = {
            labelBy: "name",
            sortBy: "score",
            data: data,
            icon: "iconUrl",
            onRowPress: (item, index) => {
                alert(item.name + " clicked", item.score + " points, wow!");
            },
            evenRowColor: "#edfcf9"
        };

    return (
        <View style={{ flex: 1 }}>
            {/* Ghetto Header */}
            <View
                style={{
                    paddingTop: 50,
                    backgroundColor: "black",
                    alignItems: "center"
                }}
            >
                <Text style={{ fontSize: 30, color: "white", paddingBottom: 10 }}>
                    Leaderboard
                </Text>
            </View>
            <Leaderboard {...props} />
        </View>
    );
}

const DATA = [
    {
        name: "St Lucia",
        score: 30,
    },
    {
        name: "Toowong",
        score: 50,
    },
    {
        name: "Indooroopilly",
        score: 10,
    },
    {
        name: "Gold Coast",
        score: 15,
    }
];

export default PvCLeaderboard;