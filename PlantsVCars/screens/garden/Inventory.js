import {Text, View, Button, StyleSheet, Alert, TouchableOpacity} from "react-native";
import React, {useState, useEffect} from "react";
import { set } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {img} from "../../images/manifest"

const Inventory = (props) => {

    // visual
    return (
        <>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Water") {
                        props.setInteraction("Water");
                        props.setWater(true);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    } else {
                        props.setInteraction("None");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    }
                }}>
                    {props.water ? 
                    <View>
                        {img({name: "WaterOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Water", style:styles.itemIcon})}
                    </View>}
                    <Text style={styles.pricing}> -$10</Text>
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Sun") {
                        props.setInteraction("Sun");
                        props.setWater(false);
                        props.setSun(true);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    } else {
                        props.setInteraction("None");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    }
                }}>
                    {props.sun ? 
                    <View>
                        {img({name: "SunlightOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Sunlight", style:styles.itemIcon})}
                    </View>}
                    <Text style={styles.pricing}> -$40</Text>
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Fertilizer") {
                        props.setInteraction("Fertilizer");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(true);
                        props.setShovel(false);
                    } else {
                        props.setInteraction("None");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    }
                }}>
                    {props.fertilizer ? 
                    <View>
                        {img({name: "FertiliserOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Fertiliser", style:styles.itemIcon})}
                    </View>}
                    <Text style={styles.pricing}> -$20</Text>
                </TouchableOpacity>
            </>
            <>
                <TouchableOpacity style={styles.elements} onPress={() => {
                    // remove currency
                    if (props.interaction != "Shovel") {
                        props.setInteraction("Shovel");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(true);
                    } else {
                        props.setInteraction("None");
                        props.setWater(false);
                        props.setSun(false);
                        props.setFertilizer(false);
                        props.setShovel(false);
                    }
                }}>
                    {props.shovel ? 
                    <View>
                        {img({name: "ShovelOutlined", style:styles.itemIcon})}
                    </View>:
                    <View>
                        {img({name: "Shovel", style:styles.itemIcon})}
                    </View>}
                    <Text style={styles.pricing}> -$00</Text>
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
    pricing: {
        position: 'absolute',
        paddingTop: '70%',
        fontSize: 14,
        fontFamily: 'PressStart2P',
        color: 'yellow',
        fontWeight: "bold"
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