import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import PvCLeaderboard from './screens/Leaderboard';


const Tab = createBottomTabNavigator();
const seasons = ["Summer", "Autumn", "Winter", "Spring"];
const Stack = createStackNavigator();

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)] // getMonth returns month from 0 - 11

const MyCollection = () => {
  return (
    <View>
      <Text> Collections page</Text>
    </View>
  )
}

const MyGardenNav = ({}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name = "My Garden" component = {MyGarden} options = {{headerShown: false}}/>
      <Stack.Screen name = "My Collection" component = {MyCollection}/>      
    </Stack.Navigator>
  )
}
const MyGarden = ({navigation}) => {
  const [inventory, setInventory] = useState([]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', backgroundColor: "brown"}}>
        <Button
          title = "My Collection"
          onPress = { () => navigation.navigate("My Collection")}
        />
      </View>
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

const OurForest = () => {
  return (
    <View style={styles.container}>
      <Text>This will be the suburb forest for multiplayer.</Text>
    </View>
  );
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
      <Tab.Navigator>
        <Tab.Screen name="My Garden" component={MyGardenNav} />
        <Tab.Screen name="Our Forest" component={OurForest} />
        <Tab.Screen name={"Challenges"} component={Challenges} />
        <Tab.Screen name="Leaderboard" component={PvCLeaderboard} />
      </Tab.Navigator>
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