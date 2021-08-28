import React, {useEffect, useState} from "react";
import {getSettings, setSetting, STORAGE_KEY} from "./Storage"

import {ScrollView, Switch, Text, TouchableOpacity, View} from "react-native";
import {StyleSheet} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import DatePicker from "react-native-date-picker";
import {Modal} from "react-native";
import pick from "react-native-web/dist/modules/pick";

const Stack = createStackNavigator();

const SettingsNav = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name={"SettingsScreen"}
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
            onPress: () => setHasBicycle(hasBicycle => !hasBicycle)
        },
        {
            title: "Scooter",
            subtitle: "Do you have a scooter?",
            toggle: hasScooter,
            onPress: () => setHasScooter(hasScooter => !hasScooter)
        },
        {
            title: "Bus",
            subtitle: "Do you have access to a bus?",
            toggle: hasBus,
            onPress: () => setHasBus(hasBus => !hasBus)
        },
        {
            title: "Train",
            subtitle: "Do you have access to a train?",
            toggle: hasTrain,
            onPress: () => setHasTrain(hasTrain => !hasTrain)
        },
    ];


    /* Get settings from internal storage */
    useEffect(() => {
        getSettings(STORAGE_KEY.hasBicycle, setHasBicycle)
        getSettings(STORAGE_KEY.hasScooter, setHasScooter)
        getSettings(STORAGE_KEY.hasBus, setHasBus)
        getSettings(STORAGE_KEY.hasTrain, setHasTrain)
    }, [])

    /* Set settings in internal storage */
    useEffect(() => {
        setSetting(STORAGE_KEY.hasBicycle, hasBicycle)
        setSetting(STORAGE_KEY.hasScooter, hasScooter)
        setSetting(STORAGE_KEY.hasBus, hasBus)
        setSetting(STORAGE_KEY.hasTrain, hasTrain)
    }, [hasBicycle, hasScooter, hasBus, hasTrain])

    return <SettingsComponent settingsOptions={settingsOptions}/>
}

const pick_date = () => {
    const [data, setDate] = useState(new Date())

    return <DatePicker date={date} onDateChange={setDate} />
}

const SettingsComponent = ({settingsOptions, popupVis, setPopupVis, pickDate}) => {
    return (
        // <Modal visible={popupVis}>
        //     <View>
        //         {pickDate.map(name, onPress)} => (
        //
        //         )
        //     </View>
        // />





        <ScrollView>
            {settingsOptions.map(({title, subtitle, onPress, toggle, setToggle}) => (
                <View style={styles.rowContainer}>
                    <TouchableOpacity
                        key={title}
                        subtitle={subtitle}
                        onPress={onPress}
                        toggle={toggle}
                        setToggle={setToggle}
                        style={styles.touchableOpacity}>
                        <View style={styles.container}>
                            <Text style={styles.title}>
                                {title}
                            </Text>
                            {
                                subtitle != null && (
                                <Text style={styles.subtitle}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                    </TouchableOpacity>
                    {
                        toggle != null && (
                            <View style={[styles.container, styles.switch]}>
                                <Switch
                                    value={toggle}
                                    onValueChange={onPress}/>
                            </View>

                        )
                    }
                </View>
                ))}

        </ScrollView>
    )
}

{/*function wrapperComponent() {*/}
{/*    return (*/}
{/*        <View>*/}
{/*            <Modal>*/}
{/*                <View style={{ flex:1}}>*/}
{/*                    /!*<DatePicker date={date} onDateChange={setDate}/>*!/*/}
{/*                </View>*/}
{/*            </Modal>*/}
{/*        </View>*/}
{/*    )*/}
{/*}*/}

const Settings = ({navigation}) => {
    const [date, setDate] = React.useState(new Date());
    const [age, setAge] = React.useState(new Date());
    const [popupVis, setPopupVis] = React.useState(false)

    const settingsOptions = [
        {
            title: "My Age",
            subtitle: "Configure your date of birth",
            onPress: () => {<DatePicker date={date} onDateChange={setDate}/>}
        },
        {
            title: "My Transport",
            subtitle: "Configure your available transport",
            onPress: () => {navigation.navigate("Configure Transport")}
        },
        {
            title: "About ",
            onPress: () => {setPopupVis(true)}
        },
    ];

    const pickDate = [
        {
            name: "Pick Date",

            onPress: () => {
                setSetting(STORAGE_KEY.age, age)
                setPopupVis(true)
            }
        }
    ]

    return (
        <SettingsComponent
            settingsOptions={settingsOptions}
            popupVis={popupVis}
            setPopupVis={setPopupVis}
            pickDate={pickDate}
        />)
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18
    },
    subtitle: {
        fontSize:14, opacity: 0.5, paddingTop: 5
    },
    touchableOpacity: {
        flex: 1
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    rowContainer: {
        flexDirection: "row",
    },
    switch:{
        justifyContent: "flex-end"
    }
});

export default SettingsNav;