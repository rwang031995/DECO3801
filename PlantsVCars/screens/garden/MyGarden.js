import {Text, View, Button, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Alert} from "react-native";
import React, {useContext, useState} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import userId from '../home/userId';
import {firebase, getFirebaseValue} from "../settings/Firebase"
import moment from 'moment';


//RETRIEVED FROM https://morioh.com/p/e42eec224939
import ImageZoom from 'react-native-image-pan-zoom'

import Inventory from "./Inventory";
import {img} from "../../images/manifest"
import { useEffect } from "react/cjs/react.development";
import { set } from "react-native-reanimated";


const seasons = ["Summer", "Autumn", "Winter", "Spring"];

var date = new Date();
var season = seasons[Math.ceil((date.getMonth() + 1) / 4)]; // getMonth returns month from 0 - 11

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Stack = createStackNavigator();

/**
 * Navigation stack
 */

const MyGardenNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Garden" component={MyGarden}
                    options={{headerShown: false}}/>
      <Stack.Screen name="My Collection" component={MyCollection}
                    options={{headerShown: false}}/>
      <Stack.Screen name="My Collection Selection" component={MyCollectionSelection}
                    options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

/**
 * Colletions page
 */

const MyCollection = () => {
  return (
    <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}> 
      <View style={styles.flowerContainer}>
          {img({name: "DandelionFlower", style: styles.inventoryFlower})}
          {img({name: "OrchidFlower", style: styles.inventoryFlower})}
          {img({name: "SunflowerFlower", style: styles.inventoryFlower})}
          {img({name: "TulipFlower", style: styles.inventoryFlower})}
          {img({name: "RoseFlower", style: styles.inventoryFlower})}
      </View>
    </ImageBackground>
  )
}

/**
 * Reinstating a flower selection page
 */

const MyCollectionSelection = ({route, navigation}) => {
  const {flowerIndex, flowerHealth, currentPos, user} = route.params;

  const replaceFlower = (flowerName) => {
    changeFlower(flowerIndex, flowerName, flowerHealth);
    navigation.navigate("Garden");
  }

  const changeFlower = (index, newName, newHealth) => {
    if (newHealth > 100) {
      newHealth = 100;
    } else if (newHealth < 0) {
      newHealth = 0;
    }
    let newFlower = {name: newName, health: newHealth}
    let newFlowerSeating = [
      ...currentPos.slice(0, index),
      newFlower,
      ...currentPos.slice(index + 1)
    ]
    firebase.firestore().collection("users").doc(user).update({
      flowers: newFlowerSeating,
    }).then()
  }

  return (
    <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}> 
      <View style={{
        flex: 0, flexDirection: 'row', flexWrap: 'wrap', height: "60%",
        justifyContent: "space-around", position: 'absolute', top: '20%'
      }}>
        <TouchableOpacity style={styles.hitBox} onPress={() => replaceFlower("DandelionFlower")}>
          {img({name: "DandelionFlower", style: styles.plantTile})}
        </TouchableOpacity>
        <TouchableOpacity style={styles.hitBox} onPress={() => replaceFlower("OrchidFlower")}>
          {img({name: "OrchidFlower", style: styles.plantTile})}
        </TouchableOpacity>
        <TouchableOpacity style={styles.hitBox} onPress={() => replaceFlower("SunflowerFlower")}>
          {img({name: "SunflowerFlower", style: styles.plantTile})}
        </TouchableOpacity>
        <TouchableOpacity style={styles.hitBox} onPress={() => replaceFlower("TulipFlower")}>
          {img({name: "TulipFlower", style: styles.plantTile})}
        </TouchableOpacity>
        <TouchableOpacity style={styles.hitBox} onPress={() => replaceFlower( "RoseFlower")}>
          {img({name: "RoseFlower", style: styles.plantTile})}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

/**
 * code styling for page.
 */

const styles = StyleSheet.create({
  bgTile: {
    width: "33%",
    height: "33%",
  },
  inventoryFlower: {
    width:'33%',
    resizeMode: 'contain'
  }, 
  plantTile: {
    height: "75%",
    width: "75%",
  },
  flowerContainer: {
    flex: 0,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  overallBG: {
    height: windowHeight,
    width: windowWidth
  },
  hitBox: {
    height: "33%",
    width:"33%",
    borderStyle: "solid",
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }, selectBox: {
    height: "33%",
    width:"33%",
    borderStyle: "solid",
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }, 
  buttonTitle: {
    fontFamily: 'PressStart2P',
    color: 'darkgreen',
    fontSize: 14,
    fontWeight: "bold"
  },
  button: {
      flex: 1,
      backgroundColor: 'limegreen',
      margin: 'auto',
      height: 48,
      maxWidth: '50%',
      maxHeight: '80%',
      borderRadius: 5,
      alignItems: "center",
      justifyContent: 'center',
      elevation: 999,
    },
    flowerbar: {
      fontFamily: 'PressStart2P',
      color: 'cyan',
      fontSize: 12,
      fontWeight: "bold",
      maxHeight: '20%',
      position: "absolute",
      marginTop: '75%',
    }

})


/////////////////////////////////////////////////////////////////////////////////////////
/////                                                                               /////
/////                              GARDEN COMPONENT                                 /////
/////                                                                               /////
/////////////////////////////////////////////////////////////////////////////////////////

const MyGarden = ({navigation}) => {
  const [flowerSeating, setFlowerSeating] = useState([
    {name: "DandelionFlower", health: 0},
    {name: "RoseFlower", health: 0},
    {name: "OrchidFlower", health:0},
    {name: "RoseFlower", health: 0},
    {name: "OrchidFlower", health: 0},
    {name: "TulipFlower", health: 0}
  ]);
  const [gardenHealth, setGardenHealth] = useState(0);
  const [healthModifier, setHealthModifier] = useState(1);
  const [currency, setCurrency] = useState(500);
  const [interaction, setInteraction] = useState("None");
  const [water, setWater] = useState(false);
  const [sun, setSun] = useState(false);
  const [fertilizer, setFertilizer] = useState(false);
  const [shovel, setShovel] = useState(false);
  const uid = useContext(userId);

  /**
   * Changes the garden flower at index 'index' to flower with name 'newName'
   * and sets its health to 'newHealth'.
   */

  const changeFlower = (index, newName, newHealth) => {
    if (newHealth > 100) {
      newHealth = 100;
    } else if (newHealth < 0) {
      newHealth = 0;
    }
    let newFlower = {name: newName, health: newHealth}
    let newFlowerSeating = [
      ...flowerSeating.slice(0, index),
      newFlower,
      ...flowerSeating.slice(index + 1)
    ]
    firebase.firestore().collection("users").doc(uid).update({
      flowers: newFlowerSeating,
    }).then()
  }

/**
 * reduce currency.
 */
  const subtractCost = (number) => {
    let newAmount = currency - number;
    firebase.firestore().collection("users").doc(uid).update({
      currency: newAmount,
    }).then();
  }

/**
 * Unselect all selected inventory items.
 */
  const deselectAll = () => {
    setWater(false);
    setSun(false);
    setFertilizer(false);
    setShovel(false);
  }

/**
 * Use inventory item on flower
 */
  const useOnFlower = (index) => {
    switch (interaction) {
      case "Water":
        if (currency >= 10) {
          changeFlower(index, flowerSeating[index].name, flowerSeating[index].health + (10 * healthModifier));
          subtractCost(10);
          updateHealth(true);
        } else (
          alert("Not enough funds")
        )
        setInteraction("None");
        deselectAll();
        break;
      case "Fertilizer":
        if (currency >= 20) {
          setHealthModifier(2);
          subtractCost(20);
        } else (
          alert("Not enough funds")
        )
        setInteraction("None");
        deselectAll();
        break;
      case "Sun":
        if (currency >= 40) {
          changeFlower(index, flowerSeating[index].name, flowerSeating[index].health + (50 * healthModifier));
          subtractCost(40);
          updateHealth(true);
        } else (
          alert("Not enough funds")
        )
        setInteraction("None");
        deselectAll();
        break;
      case "Shovel":
        changeFlower(index, "Barren", flowerSeating[index].health)
        setInteraction("None");
        deselectAll();
        break;
      case "None":
        if (flowerSeating[index].name == "Barren"){
          navigation.navigate("My Collection Selection", {flowerIndex: index, flowerHealth: flowerSeating[index].health, currentPos: flowerSeating, user: uid});
        }
        break;
    }
  }

/**
 * Reduces garden health since last logged hour.
 */
  const checkTime = () => {
    let currentHour = moment().startOf("hour");
    firebase.firestore().collection("users").doc(uid).get().then((doc) => {
      let recordedHour = moment().startOf("hour");
      let databaseTime = doc.data().recordedTime
      let databaseTimeString = databaseTime.substring(1, databaseTime.length - 1);
      recordedHour = moment(databaseTimeString);
      let hourChange = moment.duration(currentHour.diff(recordedHour)).asHours();
      let garden = doc.data().flowers;
      if (hourChange > 0) {
        for (let i = 0; i < garden.length; i++) {
          if (garden[i].health - hourChange < 0) {
            garden[i].health = 0;
          } else {
            garden[i].health = garden[i].health - hourChange;
          }
        }
      }

      firebase.firestore().collection("users").doc(uid).update({
        recordedTime: JSON.stringify(currentHour),
        flowers: garden,
      }).then()
    })

  }
  
/**
 * Checks for time running.
 */
  useEffect(() => {
    const interval = setInterval(() => {
      checkTime();
      updateHealth(false);
    }, 500)
    return () => clearInterval(interval)
  }, []);

  /**
   * Update the health
   * @param updateLeaderboard
   */
  const updateHealth = (updateLeaderboard) => {
    firebase.firestore().collection("users").doc(uid).get().then((doc) => {
      let sum = 0;
      for (let i = 0; i < flowerSeating.length; i++) {
        sum = sum + doc.data().flowers[i].health
      }
      /* Add score to suburb */
      let finalSum = Math.ceil(sum / flowerSeating.length)
      if (updateLeaderboard) {
        firebase.firestore().collection("users").doc(uid).get().then(
          doc => {
            const leaderboardDb = firebase.firestore().collection("leaderboard").doc(doc.data().suburb)
            leaderboardDb.get().then(
              doc => {
                leaderboardDb.update({
                  score: doc.data().score + finalSum - gardenHealth
                }).then()
              }
            )
          }
        )
      }
      setGardenHealth(finalSum);
    })
  }

      /**
   * Database functions for flowers and currency
   */
  const loadFlowers = async () => {
    if ((await firebase.firestore().collection("users").doc(uid).get()).exists) {
      firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
        setFlowerSeating(doc.data().flowers);
      });
    }
    updateHealth(false);
  }
  
  const loadCurrency = async () => {
    if ((await firebase.firestore().collection("users").doc(uid).get()).exists) {
      firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
        setCurrency(doc.data().currency);
      })
    } else {
      setCurrency(0);
    }
  }
  
  useEffect(() => {
    loadFlowers().then();
    loadCurrency().then();
  }, [])
  

  let seasonBG = (
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
      flex: 0, flexDirection: 'row', flexWrap: 'wrap', height: "60%",
      justifyContent: "space-around", position: 'absolute', top: '20%'
    }}>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(0)}>
        {img({name: flowerSeating[0].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[0].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(1)}>
        {img({name: flowerSeating[1].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[1].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(2)}>
        {img({name: flowerSeating[2].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[2].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(3)}>
        {img({name: flowerSeating[3].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[3].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(4)}>
        {img({name: flowerSeating[4].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[4].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(5)}>
        {img({name: flowerSeating[5].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[5].health}</Text>
      </TouchableOpacity>
    </View>
  );

  var plantsInGround = (
    // TODO: make this dynamic somehow
    <View style={{
      flex: 0, flexDirection: 'row', flexWrap: 'wrap', height: "60%",
      justifyContent: "space-around", position: 'absolute', top: '20%'
    }}>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(0)}>
        {img({name: flowerSeating[0].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[0].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(1)}>
        {img({name: flowerSeating[1].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[1].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(2)}>
        {img({name: flowerSeating[2].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[2].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(3)}>
        {img({name: flowerSeating[3].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[3].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(4)}>
        {img({name: flowerSeating[4].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[4].health}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.hitBox} onPress={() => useOnFlower(5)}>
        {img({name: flowerSeating[5].name, style: styles.plantTile})}
        <Text style={styles.flowerbar}>♥{flowerSeating[5].health}</Text>
      </TouchableOpacity>
    </View>
  );

  return (  
    <View style={{flex: 1}}>  
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "orange"
      }}>
          <ImageBackground source={require('../../images/bg/table.png')} 
          style={{flex:1, width:"100%", height:"100%", alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row'}}>   
            <TouchableOpacity style={styles.button} 
              onPress={() => navigation.navigate("My Collection")}>
              <Text style={styles.buttonTitle}>Collection</Text>
            </TouchableOpacity>
            <View style={{marginTop: "2%"}}>
              <Text style={[styles.buttonTitle, {fontSize: 18, color: 'cyan'}]}>
                ♥{gardenHealth}</Text>
            </View>
            <View style={{marginTop: "2%"}}>
              <Text style={[styles.buttonTitle, {fontSize: 18, color: 'yellow'}]}>
                ${currency}</Text>
            </View>
          </ImageBackground>
        <View style={{flex: 6, backgroundColor: "lightgreen"}}>

          <ImageZoom cropWidth={windowWidth}
                    cropHeight={windowHeight}
                    imageWidth={windowWidth}
                    imageHeight={windowHeight}
                    minScale={1}
          >
            {img({name: season+"-bg-animated", style: styles.overallBG})}
            <View style={{position:"absolute", height:"100%", width:"100%"}}>
              {plantsInGround}
            </View>

          </ImageZoom>
        </View>
      </View> 
        <View style={{ height:"18%", justifyContent: 'center'}}>
        <ImageBackground source={require('../../images/bg/table.png')} 
          style={{width:"100%", height:"100%", flexDirection:"row"}} resizeMode="stretch">    
            <Inventory setInteraction={setInteraction} interaction={interaction} setWater={setWater} water={water} 
            setSun={setSun} sun={sun} setFertilizer={setFertilizer} fertilizer={fertilizer} setShovel={setShovel} shovel={shovel}
            />
        </ImageBackground>
        </View>
    </View>
  );
}

export default MyGardenNav;