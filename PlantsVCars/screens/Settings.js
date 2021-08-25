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
    const [hasBicycle, setHasBicycle] = useToggle();
    const [hasScooter, setHasScooter] = useToggle();
    const [hasBus, setHasBus] = useToggle();
    const [hasTrain, setHasTrain] = useToggle();

    const settingsOptions = [
        {
            title: "Bicycle",
            subtitle: "Do you have a bicycle?",
            toggle: hasBicycle,
            setToggle: () => setHasBicycle()
        },
        {
            title: "Scooter",
            subtitle: "Do you have a scooter?",
            toggle: hasScooter,
            setToggle: () => setHasScooter()
        },
        {
            title: "Bus",
            subtitle: "Do you have access to a bus?",
            toggle: hasBus,
            setToggle: () => setHasBus()
        },
        {
            title: "Train",
            subtitle: "Do you have access to a train?",
            toggle: hasTrain,
            setToggle: () => setHasTrain()
        },
    ];

    const saveSetting = async (key, value) => {
        await AsyncStorage.setItem(key, value);
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

    const saveSetting = (key, value) => {
        AsyncStorage.setItem(key, value);
    };

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

export default SettingsNav;