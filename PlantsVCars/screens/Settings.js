import React, {useEffect, useState} from "react";

import {ScrollView, Switch, Text, TouchableOpacity, View} from "react-native";
import {StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-picker";

const Stack = createStackNavigator();

const SettingsNav = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"Settings"}
                component={Settings}
                options = {{headerShown: false}}/>
            <Stack.Screen
                name={"Configure Transport"}
                component={ConfigureTransport}
                options = {{headerShown: false}}/>
        </Stack.Navigator>
    )
}

function useToggle(initialVal = false) {
    const [value, setValue] = React.useState(initialVal);

    const toggle = React.useCallback(() => {
        setValue(v => !v);
    }, []);

    return [value, toggle];
}

const ConfigureTransport = () => {
    const [hasBicycle, setHasBicycle] = React.useState(false);
    const [hasScooter, setHasScooter] = React.useState(false);
    const [hasBus, setHasBus] = React.useState(false);
    const [hasTrain, setHasTrain] = React.useState(false);

    const settingsOptions = [
        {
            title: "Bicycle",
            subtitle: "Do you have a bicycle?",
            toggle: hasBicycle,
            setToggle: () => setHasBicycle(hasBicycle => !hasBicycle)
        },
        {
            title: "Scooter",
            subtitle: "Do you have a scooter?",
            toggle: hasScooter,
            setToggle: () => setHasScooter(hasScooter => !hasScooter)
        },
        {
            title: "Bus",
            subtitle: "Do you have access to a bus?",
            toggle: hasBus,
            setToggle: () => setHasBus(hasBus => !hasBus)
        },
        {
            title: "Train",
            subtitle: "Do you have access to a train?",
            toggle: hasTrain,
            setToggle: () => setHasTrain(hasTrain => !hasTrain)
        },
    ];

    // const getSettings = async () => {
    //     const user = await AsyncStorage.getItem(STORAGE_KEY.hasBicycle).then((value) => {
    //         if (value) {
    //             setHasBicycle(parseInt(value));
    //         }
    //     });
    // };

    const getSettings = (storageKey, setState) => {

        AsyncStorage.getItem(storageKey).then((value) => {
            console.log(value)
            setState(JSON.parse(value))
        })
    }

    useEffect(() => {
        getSettings(STORAGE_KEY.hasBicycle, setHasBicycle)
        getSettings(STORAGE_KEY.hasScooter, setHasScooter)
        getSettings(STORAGE_KEY.hasBus, setHasBus)
        getSettings(STORAGE_KEY.hasTrain, setHasTrain)
    }, [])

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY.hasBicycle,`${hasBicycle}`)
        AsyncStorage.setItem(STORAGE_KEY.hasScooter,`${hasScooter}`)
        AsyncStorage.setItem(STORAGE_KEY.hasBus,`${hasBus}`)
        AsyncStorage.setItem(STORAGE_KEY.hasTrain,`${hasTrain}`)
    }, [hasBicycle, hasScooter, hasBus, hasTrain])

    // const saveSetting = async (key, value) => {
    //     await AsyncStorage.setItem(key, value);
    // };
    //
    // const getSettings = async () => {
    //     const user = await AsyncStorage.getItem("user");
    //     setAge(JSON.parse(user).age);
    // };
    //
    // useEffect(() => {
    //     getSettings();
    // }, []);

    return <SettingsComponent settingsOptions={settingsOptions}/>
}

const SettingsComponent = ({settingsOptions}) => {
    return (
        <ScrollView>
            {settingsOptions.map(({title, subtitle, onPress, toggle, setToggle}) => (
                <View>
                <TouchableOpacity key={title} onPress={onPress}>
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            {title}
                        </Text>
                        {
                            subtitle && (
                            <Text style={styles.subtitle}>
                                {subtitle}
                            </Text>
                        )}
                    </View>

                </TouchableOpacity>
            {
                setToggle && (
                <View>
                <Switch value={toggle} onValueChange={setToggle}/>
                </View>
                )
            }
                </View>
                ))}

        </ScrollView>
    )
}

const Settings = ({navigation}) => {
    const [date, setDate] = React.useState(new Date());
    const [age, setAge] = React.useState(new Date());

    const settingsOptions = [
        {
            title: "My Age",
            subtitle: "Configure your date of birth",
            onPress: () =>
                <View>
                    <DatePicker mode={"date"} date={date} onChange={setDate}/>
                </View>
        },
        {
            title: "My Transport",
            subtitle: "Configure your available transport",
            onPress: () => {navigation.navigate("Configure Transport")}
        },
        {
            title: "About ",
            onPress: () => {}
        },
    ];

    const saveSetting = (key, value) => {
        AsyncStorage.setItem(key, value);
    };

    const getSettings = async () => {
        const user = await AsyncStorage.getItem("user");
        setAge(JSON.parse(user).age);
    };

    useEffect(() => {
        getSettings();
    }, []);

    return <SettingsComponent settingsOptions={settingsOptions}/>
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18
    },
    subtitle: {
        fontSize:14, opacity: 0.5, paddingTop: 5
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
});

const STORAGE_KEY = {

    hasBicycle : "hasBicycle",
    hasScooter : "hasScooter",
    hasBus : "hasBus",
    hasTrain : "hasTrain",
    age : "age"
}

export default SettingsNav;