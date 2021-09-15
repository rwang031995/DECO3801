import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getStorage = (storageKey, setState) => {

    try {
        AsyncStorage.getItem(storageKey).then((value) => {
            // console.log(value)
            setState(JSON.parse(value))
        })
    } catch (e) {}
}

export const setStorage = (storageKey, getState) => {
    try {
        AsyncStorage.setItem(storageKey, `${getState}`)
    } catch (e) {}
}

export const STORAGE_KEY = {

    hasBicycle : "hasBicycle",
    hasScooter : "hasScooter",
    hasBus : "hasBus",
    hasTrain : "hasTrain",
    age : "age",

    bonusChallenges : [
        {
            answered: "q1answered",
            correct: "q1correct",
        },
        {
            answered: "q2answered",
            correct: "q2correct",
        },
        {
            answered: "q3answered",
            correct: "q3correct",
        },
    ]
}