import {Text, View, Button, Image, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
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
  const [flowerSeating, setFlowerSeating] = useState([
    {name: "DandelionFlower", health: 50},
    {name: "RoseFlower", health: 50},
    {name: "OrchidFlower", health:50},
    {name: "RoseFlower", health: 0},
    {name: "OrchidFlower", health: 0},
    {name: "TulipFlower", health: 0}
  ]);
  const [gardenHealth, setGardenHealth] = useState(0);

  /**
   * Changes the garden flower at index 'index' to flower with name 'newName'
   * and sets its health to 'newHealth'.
   */

  const getGardenHealth = () => {
    var totalHealth = 0;
    for (let i = 0; i < flowerSeating.length; i++) {
      totalHealth = totalHealth + flowerSeating[i].health;
    }
    setGardenHealth(totalHealth/flowerSeating.length);
  }

  const changeFlower = (index, newName, newHealth) => {
    let newFlower = {name: newName, health: newHealth}
    setFlowerSeating([
      ...flowerSeating.slice(0,index),
      newFlower,
      ...flowerSeating.slice(index + 1)
    ]);
  }
  
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
        {img({name: flowerSeating[0].name, style: styles.plantTile})}
        {img({name: flowerSeating[1].name, style: styles.plantTile})}
        {img({name: flowerSeating[2].name, style: styles.plantTile})}
        {img({name: flowerSeating[3].name, style: styles.plantTile})}
        {img({name: flowerSeating[4].name, style: styles.plantTile})}
        {img({name: flowerSeating[5].name, style: styles.plantTile})}
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
      <Button
          title = "calculate health"
          onPress = { () => getGardenHealth()}
        />
        <Text> garden health is {gardenHealth} </Text>
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