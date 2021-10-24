import {Text, View, Button, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Alert, Animated} from "react-native";
import React, {useState, useEffect, createContext, useContext} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import * as Location from 'expo-location';
import {img} from "../../images/manifest"
import MapView, {Marker} from 'react-native-maps';
import * as Geography from "./Geography";
import userId from '../home/userId';
import {firebase} from "../settings/Firebase";
import {isCompleted, ChallengeOptions} from "../challenges/Challenges";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: "column",
    width: "100%",
    height: "100%",
  },
  icon: {
    width: 20,
    height: 20,
  },
  row: {
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: 'center',
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    width: '100%',
    height: '100%',
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  map: {
    width: '100%',
    height: '100%',    
    flex: 3,
  },
  itemIcon: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 12,
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: 'PressStart2P',
    color: 'white',
    fontWeight: "bold",
    lineHeight: 18,
    paddingRight: 12,
    paddingLeft: 12,
  },
  buttonTitle: {
    fontFamily: 'PressStart2P',
    color: 'darkorange',
    fontSize: 16,
    fontWeight: "bold"
  },
  button: {
      flex: 1,
      backgroundColor: 'darkgreen',
      height: 48,
      margin: 'auto',
      maxHeight: 48,
      paddingRight: 12,
      paddingLeft: 12,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: 'center'
    },

})

function unixDateTimeStrf(ts){
    let out = '';
    let d = new Date();
    d.setTime(ts);
    out += d.getFullYear() 
    out += '-' + d.getMonth()
    out += '-' + d.getDay() 
    out += ' ' + d.getHours() 
    out += ':' + d.getMinutes() 
    out +=':' + d.getSeconds()
    out +='.' + d.getMilliseconds()
    return out;
}

function timeParse(start, end){
    let td = Math.round((end - start)/1000);
    let out = '';
    let days = Math.round(td / 86400);
    if (days > 0) {
        out += days + " days, "
        td -= (days*86400);
    }
    let hours = Math.round(td/3600);
    if (hours > 0) {
        out += hours + " hours, "
        td -= (hours*3600);
    }
    let minutes = Math.round(td/60);
    if (minutes > 0) {
        out += minutes + " minutes, "
        td -= (minutes*60);
    }
    out += td + " seconds"
    return out;
}

function distanceFormat(distance) {
    let out = "";
    let d = Math.abs(distance)
    if (d > 1000) {
        return Math.round(d / 10)/100 + " km";
    } else {
        return Math.round(d) + " m";
    }

}

function imageNameSelect(mode){
    switch (mode) {
        case "bus":
        case "train":
        case "public":
            return "PublicTransportIcon";
        case "bike":
        case "scooter":
        case "active":
            return "ActiveTransportIcon";
        case "walk":
        default:
           return "WalkingIcon"; 
    }
}

function makeRegion(startLocation, currentLocation){
    if (currentLocation == null || currentLocation.coords == null){
       return {
        "latitude": startLocation.coords.latitude,
        "longitude": startLocation.coords.longitude,
        "latitudeDelta": 0.01,
        "longitudeDelta": 0.01,
       }
    } else {
        return {
            "latitude": (startLocation.coords.latitude + currentLocation.coords.latitude)/2,
            "longitude": (startLocation.coords.longitude + currentLocation.coords.longitude)/2,
            "latitudeDelta": Math.abs(startLocation.coords.latitude - currentLocation.coords.latitude) + 0.005,
            "longitudeDelta": Math.abs(startLocation.coords.longitude - currentLocation.coords.longitude) + 0.005,
        }
    }
}

async function currentPositionAsync(){
    let loc = await Location.getLastKnownPositionAsync({'maxAge': 30000, 'requiredAccuracy': 100});
    if (loc == null){
        console.log("Needed fresh location")
        return await Location.getCurrentPositionAsync({});
    } else {
        console.log("Used existing location")
        return loc;
    }
}

function testLocationAtPT(location, mode, maxDist){
    console.log("TST", Geography.trainStationsTree.length);
    console.log("BST", Geography.busStopsTree.length);
    // let pt = {"type": "Point", "coordinates": [location.coords.longitude, location.coords.latitude]};
    let pt = Geography.eastingsNorthings([location.coords.longitude, location.coords.latitude]);
    console.log("pt", pt);
    if(mode == "bus"){
        let rez = Geography.busStopsTree.nn(pt);
        let rez_pt = Geography._busStopPoints[rez];
        let dist = Math.hypot((pt[0] - rez_pt[0]), (pt[1] - rez_pt[1]))
        console.log("rez", rez, rez_pt, Geography._busStopIDs[rez], dist);
        return dist < maxDist;
    } else if (mode == "train"){
        let rez = Geography.trainStationsTree.nn(pt);
        let rez_pt = Geography._trainStationPoints[rez];
        let dist = Math.hypot((pt[0] - rez_pt[0]), (pt[1] - rez_pt[1]))
        console.log("rez", rez, rez_pt, Geography._trainStationIDs[rez], dist);
        return dist < maxDist;
    }
}

const Stack = createStackNavigator();

const JourneyScreen = ({ navigation}) => {
        React.useLayoutEffect(() => {
            navigation.setOptions({
                headerShown: false,
            })
        }, []);

  return (
      <Stack.Navigator>
        <Stack.Screen name="Make a Journey" component={JourneyStartScreen}/>
        <Stack.Screen name="Challenge Completed" component={ChallengeCompletedScreen}/>
      </Stack.Navigator>
  );
}

const JourneyStartScreen = ({ navigation }) => {
      const [startLocation, setStartLocation] = useState(null);
      const [endLocation, setEndLocation] = useState(null);
      const [errorMsg, setErrorMsg] = useState(null);
      const [status, setStatus] = useState(null);
      const [tripType, setTripType] = useState(null);
      const [challengeCompleted, setChallengeCompleted] = useState(null);

      const uid = useContext(userId);
      const [challenges, setChallenges] = useState(null);
    
      // now we have our challenges
      const loadChallenges = async () => {
        firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
          setChallenges(doc.data().challenges);
        })
      }

      const completeChallenge = (mode) => {
        let challengesTemp = [...challenges];
        let result = null;
        for (let i = 0; i < challenges.length; i++) {
            console.log("Considering", challengesTemp[i]);
          if ((challengesTemp[i].mode == mode) && 
                (challengesTemp[i].completed != isCompleted[1]) ) {
            challengesTemp[i].completed = isCompleted[1];
            result = challengesTemp[i].challenge;
            break
          }
        }
        setChallenges(challengesTemp);
        firebase.firestore().collection("users").doc(uid).update({
          challenges: challengesTemp
        })
        return result;
      }


      useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
          setStatus(status);
        })();
      }, []);
      
    
    // make the UI snappy
    var loc = Location.getCurrentPositionAsync();

    // we have this insane conditional setup because useState is limited. 
    // TODO, maybe: refactor for useContext?
    if ((startLocation == null) || 
        ( startLocation !== null && endLocation !== null 
            && endLocation.timestamp < startLocation.timestamp )){
        // Before trip start
        return (
            <View style={styles.container}>
                <MapView 
                        style = {styles.map}
                        showsUserLocation = {true}
                        pitchEnabled = {false}
                />
            <ImageBackground source={require('../../images/bg/challengesbg.png')} style={styles.row}> 
                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        setEndLocation(null);
                        let location = await currentPositionAsync();
                        // test whether we're at a bus or a train stop
                        if(testLocationAtPT(location, "bus", 200)){                                                        
                            setStartLocation(location);
                            setTripType("bus");
                        } else {
                            Alert.alert('', "Please start your trip when you're at a bus stop");
                        }
                    }}
                >
                {img({name: "PublicTransportIcon", style:styles.itemIcon}) /*TODO: bus */}
                </TouchableOpacity>

                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        setEndLocation(null);
                        let location = await currentPositionAsync();
                        // test whether we're at a train station
                        if(testLocationAtPT(location, "train", 200)){                                                        
                            setStartLocation(location);
                            setTripType("train");
                        } else{
                            Alert.alert('', "Please start your trip when you're at a train station");
                        }
                    }}
                >
                {img({name: "PublicTransportIcon", style:styles.itemIcon}) /*TODO: train */ }
                </TouchableOpacity>
                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setStartLocation(location);
                        setEndLocation(null);
                        setTripType("walk");
                    }}
                >
                {img({name: "WalkingIcon", style:styles.itemIcon})}
                </TouchableOpacity>
                </ImageBackground>
            <ImageBackground source={require('../../images/bg/challengesbg.png')} style={styles.row}> 

                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setStartLocation(location);
                        setEndLocation(null);
                        setTripType("bike");
                    }}
                >
                {img({name: "ActiveTransportIcon", style:styles.itemIcon}) /*TODO: bike */ }
                </TouchableOpacity>

                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setStartLocation(location);
                        setEndLocation(null);
                        setTripType("scooter");
                    }}
                >
                {img({name: "ActiveTransportIcon", style:styles.itemIcon}) /*TODO: scooter */ }
                </TouchableOpacity>

                <View style={styles.itemIcon}>
                <Text style={{fontSize: 14, fontFamily: 'PressStart2P', color:'white', textAlign:'center', marginTop: 'auto', marginBottom: 'auto'}}>
                    Select a mode to begin your journey!</Text>
                </View>
            </ImageBackground>
            </View>        
        )
    } else if (((startLocation !== null) && (endLocation == null))) {
        // Mid trip display
    //                         image={{uri: "../images/"+imageNameSelect(tripType)+'.png'}}

        return (
        <View style={styles.container}>
                <MapView 
                    style = {styles.map}
                    showsUserLocation = {true}
                    region = {makeRegion(startLocation, loc)}
                    rotateEnabled = {false}
                    pitchEnabled = {false}
                >
                    <Marker
                        title="Start"
                        coordinate={startLocation.coords}
                    />
                </MapView>
            <ImageBackground source={require('../../images/bg/challengesbg.png')} style={styles.row}> 
                {img({name: imageNameSelect(tripType), style:styles.itemIcon})}

                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {
                        let location = await currentPositionAsync();
                        setEndLocation(location);
                        // evaluate trip type: sanity-check speeds for walking and active transport
                        // we already checked that they got on near a PT node
                        let startEN = Geography.eastingsNorthings([startLocation.coords.longitude, startLocation.coords.latitude]);
                        let stopEN = Geography.eastingsNorthings([location.coords.longitude, location.coords.latitude]);
                        let dist_m = Math.hypot((startEN[0] - stopEN[0]), (startEN[1] - stopEN[1]));
                        let time_ms = Math.abs(location.timestamp - startLocation.timestamp) + 1;
                        let speed_kmh = dist_m/(time_ms * 3600); // metres per millisecond is kilometres per second...
                        if ((tripType == walk) && (speed_kmh > 15)){
                            console.log("walked too fast");
                            setStartLocation(null);
                            setEndLocation(null);                                    
                            return;
                        } else if ((tripType == "bike" || tripType == "scooter") && (speed_kmh > 50)) {
                            console.log("cycled or scooted too fast");
                            setStartLocation(null);
                            setEndLocation(null);                                    
                            return;
                        }
                                                
                        // update challenge?
                        await loadChallenges();
                        console.log("Challenges available?");
                        console.log(challenges);

                        // navigate straight to challengeCompleted screen if relevant
                        let result = completeChallenge(tripType);
                        console.log("result:", result)
                        if (result != null){
                            setStartLocation(null);
                            setEndLocation(null);                                    
                            navigation.navigate('Challenge Completed', {"tripType": tripType, "challenge": result});                    
                        } else {
                            console.log("No challenge completed this trip.")
                        }
                    }}
                    >
                    <Text style={styles.buttonTitle}>I'm There!</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
        )
    } else if (endLocation !== null) {
        return (        
            <View style={styles.container}>
                <MapView 
                    style = {styles.map}
                    region = {makeRegion(startLocation, endLocation)}
                    rotateEnabled = {false}
                    pitchEnabled = {false}
                >
                    <Marker
                        title="Start"
                        coordinate={startLocation.coords}
                        pinColor={"red"}
                    />
                    <Marker
                        title="End"
                        coordinate={endLocation.coords}
                        pinColor={"purple"}
                    />
                </MapView>
                <ImageBackground source={require('../../images/bg/challengesbg.png')} 
                    style={styles.container}> 
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setStartLocation(null);
                            setEndLocation(null);                                                    
                        }}>
                        <Text style={styles.buttonTitle}>{distanceFormat(Geography.distanceApproxDevice(startLocation, endLocation))}</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        )
    }
}

//                 <Text>Time spent: {timeParse(startLocation.timestamp, endLocation.timestamp)}</Text>
//                 <Text>Distance travelled: {Math.round(Geography.distanceApproxDevice(startLocation, endLocation))/1000} km</Text>


const ChallengeCompletedScreen = ({ navigation, route }, tripType, challenge) => {
        React.useLayoutEffect(() => {
            navigation.setOptions({
                title: "Challenge Completed!",
                tabBarLabel: "Journey",
            })
        }, []);

    return (
        <ImageBackground source={require('../../images/bg/challengesbg.png')} 
            style={{width:"100%", height:"100%"}}> 
        <View style={styles.container}>
            <Text style={styles.label}>{route.params.challenge}</Text>
            {img({name: imageNameSelect(route.params.tripType), style:{width: "100%"}})}
            <Text style={styles.label}>You received TODO</Text>
        </View>
        </ImageBackground>
    );
}


export default JourneyScreen;