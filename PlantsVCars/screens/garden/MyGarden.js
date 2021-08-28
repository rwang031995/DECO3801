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
    oneThird: {
    width: "33%", 
    height: "33%",
    },
  })

const MyGarden = ({navigation}) => {
  const [inventory, setInventory] = useState([]);
  var seasonBG;
  if (season == 'Summer') {
    seasonBG = (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>   
        {img({name: "Summer-top", style: styles.oneThird})}
        {img({name: "Summer-duck", style: styles.oneThird})}
        {img({name: "Summer-top", style: styles.oneThird})}

        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}

        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}

        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}
        {img({name: "Summer", style: styles.oneThird})}
      </View>
    );
  } else if (season == 'Winter') {
    seasonBG = (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {img({name: "Winter-top", style: styles.oneThird})}
        {img({name: "Winter-duck", style: styles.oneThird})}
        {img({name: "Winter-top", style: styles.oneThird})}

        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}

        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}

        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}
        {img({name: "Winter", style: styles.oneThird})}
        </View>
      );
  } else if (season == 'Autumn') {
    seasonBG = (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {img({name: "Autumn-top", style: styles.oneThird})}
        {img({name: "Autumn-duck", style: styles.oneThird})}
        {img({name: "Autumn-top", style: styles.oneThird})}

        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}

        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}

        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}
        {img({name: "Autumn", style: styles.oneThird})}
        </View>
    );
  } else {
    seasonBG = (
      <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {img({name: "Spring-top", style: styles.oneThird})}
        {img({name: "Spring-duck", style: styles.oneThird})}
        {img({name: "Spring-top", style: styles.oneThird})}

        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})}

        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})}

        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})}
        {img({name: "Spring", style: styles.oneThird})} 
      </View>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', backgroundColor: "darkorange"}}>
        <Button
          title = "My Collection"
          onPress = { () => navigation.navigate("My Collection")}
        />
      </View>
      <View style={{ flex:4, backgroundColor: "lightgreen"}}>
      {seasonBG}
      <View style={{position: 'absolute', justifyContent:'center'}}>       
          <Text>
            Current date: {date.toDateString() + "\n"}
            Current season: {season + "\n"}
          </Text>
        </View>
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