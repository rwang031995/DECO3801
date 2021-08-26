import {Text, View, Button} from "react-native";
import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1)/4)]; // getMonth returns month from 0 - 11

const Stack = createStackNavigator();

const MyGardenNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name = "Garden" component = {MyGarden} options = {{headerShown: false}}/>
      <Stack.Screen name = "My Collection" component = {MyCollection} options = {{headerShown: false}}/>   
    </Stack.Navigator>
  )
}

const MyCollection = () => {
  return (
    <View>
      <Text> Collections page</Text>
    </View>
  )
}

const MyGarden = ({navigation}) => {
  const [inventory, setInventory] = useState([]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', backgroundColor: "darkorange"}}>
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

export default MyGardenNav;