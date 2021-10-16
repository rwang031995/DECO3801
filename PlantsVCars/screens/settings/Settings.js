import React, {useContext, useEffect, useState} from "react";
import {getSetting, setSetting, STORAGE_KEY} from "./Storage"

import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import DatePicker from "react-native-date-picker";
import {firebase} from "./Firebase";
import userId from "../home/userId";

const Stack = createStackNavigator();

const SettingsNav = (props) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"SettingsScreen"}
        component={Settings}
        options={{headerShown: false}}>
      </Stack.Screen>
      <Stack.Screen
        name={"Configure Transport"}
        component={ConfigureTransport}
        options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

const ConfigureTransport = () => {
  const [hasBicycle, setHasBicycle] = React.useState(false);
  const [hasScooter, setHasScooter] = React.useState(false);
  const [hasBus, setHasBus] = React.useState(false);
  const [hasTrain, setHasTrain] = React.useState(false);

  const uid = useContext(userId)

  const settingsOptions = [
    {
      title: "Bicycle",
      subtitle: "Do you have a bicycle?",
      toggle: hasBicycle,
      onPress: () => setHasBicycle(hasBicycle => !hasBicycle)
    },
    {
      title: "Bus",
      subtitle: "Do you have access to a bus?",
      toggle: hasBus,
      onPress: () => setHasBus(hasBus => !hasBus)
    },
    {
      title: "Scooter",
      subtitle: "Do you have a scooter?",
      toggle: hasScooter,
      onPress: () => setHasScooter(hasScooter => !hasScooter)
    },
    {
      title: "Train",
      subtitle: "Do you have access to a train?",
      toggle: hasTrain,
      onPress: () => setHasTrain(hasTrain => !hasTrain)
    },
  ];

  const saveSettings = async () => {
    await firebase.firestore().collection("users").doc(uid).update(
      {
        settings: {
          hasBicycle: hasBicycle,
          hasBus: hasBus,
          hasScooter: hasScooter,
          hasTrain: hasTrain
        }
      }
    )
  }

  const loadSettings = async () => {
    firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
      setHasBicycle(doc.data().settings.hasBicycle);
      setHasBus(doc.data().settings.hasBus);
      setHasScooter(doc.data().settings.hasScooter);
      setHasTrain(doc.data().settings.hasTrain)
    })
  }

  /* Get settings from internal storage */
  useEffect(() => {
    loadSettings()
    console.log("LOADING SETTINGS")
  }, [])

  /* Set settings in internal storage */
  useEffect(() => {
    saveSettings()
    console.log("SAVING SETTINGS")
  }, [[hasBicycle, hasScooter, hasBus, hasTrain]])

  return <SettingsComponent settingsOptions={settingsOptions}/>
}

const SettingsComponent = ({
                             settingsOptions,
                           }) => {
  return (
    <>


      <ScrollView>
        {settingsOptions.map(({title, subtitle, onPress, toggle}) => (
          <View key={title}>
            <TouchableOpacity
              key={title}
              subtitle={subtitle}
              onPress={onPress}
              toggle={toggle}
              style={[styles.touchableOpacity, styles.rowContainer]}>
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
              {
                toggle != null && (
                  <View style={[styles.container, styles.switch]}>
                    <Switch
                      value={toggle}
                      onValueChange={onPress}/>
                  </View>

                )
              }
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </>
  )
}

const Settings = ({navigation}) => {
  const [date, setDate] = React.useState(new Date());
  const [age, setAge] = React.useState(new Date());
  const [popupVis, setPopupVis] = React.useState(false)

  const settingsOptions = [
    {
      title: "My Age",
      subtitle: "Configure your date of birth",
      onPress: () => {
        setPopupVis(true)
      }
    },
    {
      title: "My Transport",
      subtitle: "Configure your available transport",
      onPress: () => {
        navigation.navigate("Configure Transport")
      }
    },
    {
      title: "About ",
      onPress: () => {
        setPopupVis(true)
      }
    },
  ];

  const pickDate = [
    {
      name: "Pick Date",
      date: {date},
      setDate: () => setDate(),

      onPress: () => {
        setStorage(STORAGE_KEY.age, age)
        setPopupVis(false)
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
    fontSize: 14, opacity: 0.5, paddingTop: 5
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
  switch: {
    // justifyContent: "flex-end"
    paddingTop: 40,
    marginLeft: "auto"
  }
});

export default SettingsNav;