import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSetting = (storageKey, setState) => {

  try {
    AsyncStorage.getItem(storageKey).then((value) => {
      setState(JSON.parse(value))
    })
  } catch (e) {
  }
}

export const setSetting = (storageKey, getState) => {
  try {
    AsyncStorage.setItem(storageKey, `${getState}`)
  } catch (e) {
  }

}

export const getStorage = async (storageKey) => {
  try {
    const jsonValue = await AsyncStorage.getItem(storageKey)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {

  }
}

export const setStorage = async (storageKey, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(storageKey, jsonValue)
  } catch (e) {

  }
}

export const STORAGE_KEY = {

  hasBicycle: "hasBicycle",
  hasScooter: "hasScooter",
  hasBus: "hasBus",
  hasTrain: "hasTrain",
  age: "age",

  bonusChallenges: [
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