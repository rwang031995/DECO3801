import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PvCLeaderboard from "./PvCLeaderboard"

const Tab = createBottomTabNavigator();
const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)] // getMonth returns month from 0 - 11

const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="My Garden" component={MyGarden} />
      <Tab.Screen name={"Challenges"} component={Challenges} />
      <Tab.Screen name="Leaderboard" component={PvCLeaderboard} />
    </Tab.Navigator>
  );
}

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the home page :)</Text>
    </View>
  );
}

const MyGarden = () => {
  const [inventory, setInventory] = useState([]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', backgroundColor: "lightgreen" }}>
        <Text>
          Current date: {date.toDateString() + "\n"}
          Current season: {season + "\n"}
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "orange"}}>
        <Text>
          Inventory: {inventory.length == 0 ? "Empty" : inventory}
        </Text>
      </View>
    </View>
  )
}

const Challenges = () => {
    return (
        <View style={styles.container}>
            <Text>This will be the Challenges screen</Text>
        </View>
    )
}

const App = () => {
  return (
    <NavigationContainer>
      <BottomTabs/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  }
})

export default App;