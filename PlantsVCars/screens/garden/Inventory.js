import {Text, View, Button, StyleSheet, Alert, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react";
import { set } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEM_KEYS = {
    itemWater: "@key_Water",
    itemSun: "@key_Sun",
    itemFertilizer: "@key_Fertilizer"
}

const Inventory = () => {
    // state declarations
    const [water, setWater] = useState({});
    const [sun, setSun] = useState({});
    const [fertilizer, setFertilizer] = useState({});

    // startup (only run on first render) LOOP IT!!!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    // this will check if keys are already stored and if they are, just recieve them
    // otherwise, if key doesn't exist, store a new key with a default value
    useEffect(() => {
        getItemData(ITEM_KEYS.itemWater).then( itemData => {
            console.log("YOOOOOOOOOO", itemData, "\n")
            if (itemData == null) {
                const waterDefault = {name: "Water", quantity: 10}
                setItemData(ITEM_KEYS.itemWater, waterDefault)
                setWater(waterDefault) // keep async storage and state storage seperate???? maybe better for debugging?????
            } else {
                console.log("water exists\n")
                setWater(itemData)
            }      
        });
        getItemData(ITEM_KEYS.itemSun).then( itemData => {
            if (itemData == null) {
                const sunDefault = {name: "Sun", quantity: 6}
                setItemData(ITEM_KEYS.itemSun, sunDefault)
                setSun(waterDefault) // keep async storage and state storage seperate???? maybe better for debugging?????
            } else {
                setSun(itemData)
            }    
        });
        getItemData(ITEM_KEYS.itemFertilizer).then( itemData => {
            if (itemData == null) {
                const fertilizerDefault = {name: "Fertilizer", quantity: 2}
                setItemData(ITEM_KEYS.itemFertilizer, fertilizerDefault)
                setFertilizer(waterDefault) // keep async storage and state storage seperate???? maybe better for debugging?????
            } else {
                setFertilizer(itemData)
            }    
        });
    }, []);

    // on data change (when buttons are pressed)
    useEffect(() => {
        console.log("updating items")
        console.log(water);
        setItemData(ITEM_KEYS.itemWater, water);
        setItemData(ITEM_KEYS.itemFertilizer, fertilizer);
        setItemData(ITEM_KEYS.itemSun, sun);
    }, [water, sun, fertilizer]);

    // visual
    return (
        <>
            <Text>
                Items: {water.name}: {water.quantity}
            </Text>
            <TouchableOpacity onPress={() => {
                                                water.quantity++;
                                                setWater({name: "Water", quantity: water.quantity});
                                            }}>
                <Text>
                    Add Water
                </Text>
            </TouchableOpacity>
        </>
    );
}

// fetching item data
const getItemData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return JSON.parse(jsonValue);
    } catch (e) {
        console.log("Failed to fetch item. Key: " + key);
    }
}

// setting item data
const setItemData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        return await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log("Failed to set item. Key: " + key);
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

export default Inventory;