import React, {useContext, useEffect} from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {firebase, setFirebaseValue} from "./Firebase";
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
        <Stack.Screen
          name={"Acknowledgements"}
          component={Acknowledgements}
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
  const db = firebase.firestore().collection("users").doc(uid)

  const settingsOptions = [
    {
      title: "Bicycle",
      subtitle: "Do you have a bicycle?",
      toggle: hasBicycle,
      onPress: () => db.update(
        "settings.hasBicycle", !hasBicycle
      )
    },
    {
      title: "Bus",
      subtitle: "Do you have access to a bus?",
      toggle: hasBus,
      onPress: () => db.update(
        "settings.hasBus", !hasBus
      )
    },
    {
      title: "Scooter",
      subtitle: "Do you have a scooter?",
      toggle: hasScooter,
      onPress: () => db.update(
        "settings.hasScooter", !hasScooter
      )
    },
    {
      title: "Train",
      subtitle: "Do you have access to a train?",
      toggle: hasTrain,
      onPress: () => db.update(
        "settings.hasTrain", !hasTrain
      )
    },
  ];

  /* Get settings from internal storage */
  useEffect(() => {
    let isMounted = true
    db.onSnapshot(doc => {
      if (isMounted) {
        setHasBicycle(doc.data().settings.hasBicycle)
        setHasBus(doc.data().settings.hasBus)
        setHasScooter(doc.data().settings.hasScooter)
        setHasTrain(doc.data().settings.hasTrain)
      }
    })

    console.log("Settings loaded")

    return () => (isMounted = false)
  }, [])

  return <SettingsComponent settingsOptions={settingsOptions}/>
}

const SettingsComponent = ({settingsOptions,}) => {
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

const Acknowledgements = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {fontSize: 32}]}>Acknowledgements</Text>
      <Text></Text>
      <Text style={styles.title}>Created with Expo and React Native</Text>
      <Text></Text>
      <Text style={styles.title}>Kawai Kitsune by Kevin MacLeod</Text>
      <Text>https://www.incompetech.com/music/royalty-free/index.html?isrc=USUAN1500059</Text>
      <Text>Licensed under Creative Commons: By Attribution 3.0 License</Text>
      <Text>http://creativecommons.org/licenses/by/3.0/</Text>
      <Text></Text>
      <Text  style={styles.title}>Bus and Train stop data from TransLink SEQ GTFS</Text>
      <Text>https://www.data.qld.gov.au/dataset/general-transit-feed-specification-gtfs-seq</Text>
      <Text>Licensed under Creative Commons: By Attribution 4.0 License</Text>
      <Text>http://creativecommons.org/licenses/by/4.0/</Text>
    </View>
  )

}

const Settings = ({navigation}) => {
  const uid = useContext(userId);

  const settingsOptions = [
    {
      title: "My Transport",
      subtitle: "Configure your available transport",
      onPress: () => {
        navigation.navigate("Configure Transport")
      }
    },
    {
      title: "Sign Out",
      onPress: () =>
        Alert.alert(
          "We'll miss you!",
          "Are you sure you want to sign out?",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () =>
                [
                  () => console.log("Logged out"),
                  firebase.auth().signOut().then(
                    navigation.navigate("Login")
                  ),
                  () => Alert.alert(
                    "Signed out successfully."
                  )
                ]
            }
          ]
        )
    },
    {
      title: "About ",
      onPress: () => {
        Alert.alert(
          "Created with love by \"The Masked Bandits\" DECO3801 team",
          ""
        )
      }
    },
    { // comment out if not needed, but AJ's value got really messed up
      title: "Reset Balance",
      onPress: () => {
        setFirebaseValue(uid, 'currency', 100);
      }
    },
    {
      title: "Acknowledgements",
      onPress: () => {navigation.navigate("Acknowledgements")}
    }
  ];

  return (
    <SettingsComponent
      settingsOptions={settingsOptions}
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
    paddingTop: 40,
    marginLeft: "auto"
  }
});

export default SettingsNav;