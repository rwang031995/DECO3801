import {Text, View, Button, Image, StyleSheet, Dimensions} from "react-native";
import React, {useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';

//RETRIEVED FROM https://morioh.com/p/e42eec224939
import ImageZoom from 'react-native-image-pan-zoom'

import Inventory from "./Inventory";
import {img} from "../../images/manifest"
import { useEffect } from "react/cjs/react.development";
const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1) / 4)]; // getMonth returns month from 0 - 11

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Stack = createStackNavigator();

const MyGardenNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Garden" component={MyGarden}
                    options={{headerShown: false}}/>
      <Stack.Screen name="My Collection" component={MyCollection}
                    options={{headerShown: false}}/>
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
    height: "20%",
    width: "20%",
    margin: "4%"
  },
  overallBG: {
    height: windowHeight,
    width: windowWidth
  }
})


/////////////////////////////////////////////////////////////////////////////////////////
/////                                                                               /////
/////                              GARDEN COMPONENT                                 /////
/////                                                                               /////
/////////////////////////////////////////////////////////////////////////////////////////


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
  const [interaction, setInteraction] = useState(0)

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
      ...flowerSeating.slice(0, index),
      newFlower,
      ...flowerSeating.slice(index + 1)
    ]);
  }
  
  var seasonBG = (
    <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {img({name: season+"-top", style: styles.bgTile})}
        {img({name: season+"-duck", style: styles.bgTile})}

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
    <View style={{
      flex: 0, flexDirection: 'row', flexWrap: 'wrap', height: "80%",
      justifyContent: "space-around", position: 'absolute', top: '20%'
    }}>
      {img({name: flowerSeating[0].name, style: styles.plantTile})}
      {img({name: flowerSeating[1].name, style: styles.plantTile})}
      {img({name: flowerSeating[2].name, style: styles.plantTile})}
      {img({name: flowerSeating[3].name, style: styles.plantTile})}
      {img({name: flowerSeating[4].name, style: styles.plantTile})}
      {img({name: flowerSeating[5].name, style: styles.plantTile})}
    </View>
  );

  // when interaction is changed from child
  useEffect(() => {
    switch (interaction) {
      case "Water":
        console.log("Water pressed");
        break;
      case "Fertilizer":
        console.log("Fertilizer pressed");
        break;
      case "Sun":
        console.log("Sun pressed");
    }
  }, [interaction]) 



  return (
    <View style={{flex: 1}}>
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "orange"
      }}>
        <View style={{ alignItems: 'center', backgroundColor: "darkorange"}}>
          <Button
            title = "My Collection"
            onPress = { () => navigation.navigate("My Collection")}
          />
        </View>
        <View>
            <Text> garden health is {gardenHealth} </Text>
        </View>
        <View style={{flex: 6, backgroundColor: "lightgreen"}}>

          <ImageZoom cropWidth={windowWidth}
                    cropHeight={windowHeight}
                    imageWidth={windowWidth}
                    imageHeight={windowHeight}
                    minScale={1}
          >
            {img({name: season+"-bg", style: styles.overallBG})}
            <View style={{position:"absolute", height:"100%", width:"100%"}}>
              {plantsInGround}
            </View>

          </ImageZoom>

          {/*<ImageZoom*/}
          {/*  maxZoom={1.5}*/}
          {/*  minZoom={1}*/}
          {/*  initialZoom={1}*/}
          {/*  bindToBorders={true}*/}
          {/*>*/}
          {/*    {img({name: season + "-bg", style: styles.overallBG})}*/}
          {/*  <View style={{position:"absolute", height:"100%", width:"100%"}}>*/}
          {/*    {plantsInGround}*/}
          {/*  </View>*/}

          {/*</ImageZoom>*/}

        </View>
      </View> 
      <View style={{ height:"17%", flexDirection: "row", backgroundColor: 'orange', justifyContent: 'center', flex:0}}>
        <Inventory setInteraction={setInteraction}/>
      </View>
    </View>
  );
}

export default MyGardenNav;