import {Text, View, Button, Image, StyleSheet} from "react-native";
import React, {useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import Inventory from "./Inventory";
import {img} from "../../images/manifest"

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

const styles = StyleSheet.create({
    bgTile: {
      width: "33%",
      height: "33%",
    },
    plantTile: {
        height: "25%",
        width: "25%",
        margin: "4%"
    }
  })

const MyGarden = ({navigation}) => {
  const [inventory, setInventory] = useState([]);
  
  var seasonBG = (
    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {img({name: season+"-top", style: styles.bgTile})}
        {img({name: season+"-duck", style: styles.bgTile})}
        {img({name: season+"-top", style: styles.bgTile})}

        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}

        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
        {img({name: season, style: styles.bgTile})}
    </View> 
  );
  
  var plantsInGround = (
    // TODO: make this dynamic somehow
    <View style={{flex: 0, flexDirection: 'row', flexWrap: 'wrap', height: "100%", 
        justifyContent: "space-around", position: 'absolute', top: '33%'}}>
        {img({name: "DandelionFlower", style: styles.plantTile})}
        {img({name: "RoseFlower", style: styles.plantTile})}
        {img({name: "OrchidFlower", style: styles.plantTile})}
        {img({name: "RoseFlower", style: styles.plantTile})}
        {img({name: "OrchidFlower", style: styles.plantTile})}
        {img({name: "TulipFlower", style: styles.plantTile})}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', backgroundColor: "darkorange"}}>
        <Button
          title = "My Collection"
          onPress = { () => navigation.navigate("My Collection")}
        />
      </View>
      <View style={{ flex:4, backgroundColor: "lightgreen", display:'flex'}}>
        {seasonBG}
        <View style={{position: 'absolute', justifyContent:'center'}}>       
          <Text>
            Current date: {date.toDateString() + "\n"}
            Current season: {season + "\n"}
          </Text>
        </View>
        {plantsInGround}
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