import {Text, View, Button, StyleSheet, Alert, TouchableOpacity} from "react-native";
import React, {useState} from "react";
import { set } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInstallationTimeAsync } from "expo-application";

const Inventory = () => {
    // Check if items are already set (NEEDS TO BE DONE)

    setItem(ITEM_KEYS.water, {name: 'Water', quantity: 10});
    setItem(ITEM_KEYS.sun, {name: 'Sun', quantity: 5});
    setItem(ITEM_KEYS.fertilizer, {name: 'Fertilizer', quantity: 2});

    return (
        <View style={{flex: 1}}>

            <View style={{borderTopWidth: 2, borderTopColor: "grey"}}>
                <Text style={styles.heading}>
                    Items
                </Text>
            </View>

            <View style={{flexDirection: "row"}}>
                <View style={{flex: 3}}>
                    <Text style={{flexDirection: "row", alignSelf: "flex-start", justifyContent: "space-between"}}>
                        <Items/>
                    </Text>
                </View>
            </View>
        </View>
    );
}

const Items = (props) => {
    const [water, setWater] = useState({})
    const [sun, setSun] = useState({})
    const [fertilizer, setFertilizer] = useState({})

    getItem(ITEM_KEYS.water, setWater)
    getItem(ITEM_KEYS.sun, setSun)
    getItem(ITEM_KEYS.fertilizer, setFertilizer)

    return (
        <>
            <Text>
                {water.name}: {water.quantity + " "}
            </Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={() => setItem(ITEM_KEYS.water, water)}>
                    {water.name}+
                </Text>
            </TouchableOpacity>
        </>
    );
}

const setItem = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch(e) {
        console.log("An error occured while attempting to set an item.");
    }

    console.log("Successfully stored item.");
}

const getItem = async (key, setState) => {
    try {
        console.log("Attempting to retrieve item")
        const jsonValue = await AsyncStorage.getItem(key)
        console.log(JSON.parse(jsonValue))
        setState(JSON.parse(jsonValue))
    } catch (e) {
        console.log("An error has occured while attempting to retrieve an item.");
    }
}

const styles = StyleSheet.create({
    heading: {
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: 18,
        fontWeight: "bold",
        fontSize: 18
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 4,
    },
    buttonText: {
        fontSize: 8
    }
})

const ITEM_KEYS = {

    water: "@item_Water",
    sun: "@item_Sun",
    fertilizer: "@item_Fertilizer"
}

export default Inventory;