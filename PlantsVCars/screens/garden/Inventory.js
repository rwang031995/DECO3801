import {Text, View, Button, StyleSheet, Alert, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react";
import { set } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {img} from "../../images/manifest"

const Inventory = (props) => {
    // state declarations
    const [water, setWater] = useState(false);
    const [sun, setSun] = useState(false);
    const [fertilizer, setFertilizer] = useState(false);
    const [shovel, setShovel] = useState(false);

    // visual
    return (
        <>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Water") {
                        props.setInteraction("Water");
                        setWater(true);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(false);
                    } else {
                        props.setInteraction("None");
                        setWater(false);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(false);
                    }
                }}>
                    {water ? 
                    <View>
                        {img({name: "WaterOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Water", style:styles.itemIcon})}
                    </View>}
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Sun") {
                        props.setInteraction("Sun");
                        setWater(false);
                        setSun(true);
                        setFertilizer(false);
                        setShovel(false);
                    } else {
                        props.setInteraction("None");
                        setWater(false);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(false);
                    }
                }}>
                    {sun ? 
                    <View>
                        {img({name: "SunlightOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Sunlight", style:styles.itemIcon})}
                    </View>}
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Fertilizer") {
                        props.setInteraction("Fertilizer");
                        setWater(false);
                        setSun(false);
                        setFertilizer(true);
                        setShovel(false);
                    } else {
                        props.setInteraction("None");
                        setWater(false);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(false);
                    }
                }}>
                    {fertilizer ? 
                    <View>
                        {img({name: "FertiliserOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Fertiliser", style:styles.itemIcon})}
                    </View>}
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Shovel") {
                        props.setInteraction("Shovel");
                        setWater(false);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(true);
                    } else {
                        props.setInteraction("None");
                        setWater(false);
                        setSun(false);
                        setFertilizer(false);
                        setShovel(false);
                    }
                }}>
                    {shovel ? 
                    <View>
                        {img({name: "ShovelOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Shovel", style:styles.itemIcon})}
                    </View>}
                </TouchableOpacity>
            </>
        </>
    );
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
    },

    itemIcon: {
        justifyContent: "center",
        width: "70%",
        height: "70%",
        marginLeft: "auto",
        marginRight: "auto"
    },

    elements: {
        justifyContent: "center",
        width: '25%',
        height: '100%',
    }
})

export default Inventory;