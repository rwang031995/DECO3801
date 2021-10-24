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
    justifyContent: 'space-around',
    flexDirection: "column"
    
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
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: 'PressStart2P',
    color: 'white',
    fontWeight: "bold",
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

function imageNameSelect(mode){
    switch (mode) {
        case "public":
            return "PublicTransportIcon";
            break;
        case "active":
            return "ActiveTransportIcon";
            break;
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

const Stack = createStackNavigator();

const JourneyScreen = ({ navigation, route }) => {
        React.useLayoutEffect(() => {
            navigation.setOptions({
                title: "Make a Journey",
                tabBarLabel: "Journey",
            })
        }, []);

  return (
      <Stack.Navigator 
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name="Start Journey" component={JourneyStartScreen}/>
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
          if ((challengesTemp[i].mode == mode) /*&& 
                (challengesTemp[i].completed != isCompleted[1])*/ ) {
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
                        if(true){
                            Alert.alert('', "Please start your trip when you're at a train station or bus stop");
                        }
                            
                        // still here?
                        setStartLocation(location);
                        setTripType("public");
                    }}
                >
                {img({name: "PublicTransportIcon", style:styles.itemIcon})}
                <Text style={styles.label}>Catch!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setStartLocation(location);
                        setEndLocation(null);
                        setTripType("walking");
                    }}
                >
                {img({name: "WalkingIcon", style:styles.itemIcon})}
                <Text style={styles.label}>Walk!</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style = {styles.itemIcon} // need this to be set
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setStartLocation(location);
                        setEndLocation(null);
                        setTripType("active");
                    }}
                >
                {img({name: "ActiveTransportIcon", style:styles.itemIcon})}
                <Text style={styles.label}>Ride!</Text>
                </TouchableOpacity>
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
                        // evaluate trip type
                        
                        // we tested that they got on PT, so we'll trust that they got off OK
                        
                        // sanity check for walking - less than 10 km/h average
                        
                        // sanity check for active - less than 40 km/h average 
                        
                        // update challenge?
                        await loadChallenges();
                        console.log("Challenges available?");
                        console.log(challenges);
                    }}
                    >
                    <Text style={styles.buttonTitle}>I'm There!</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
        )
    } else if (endLocation !== null) {
        // 
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
            <ImageBackground source={require('../../images/bg/challengesbg.png')} style={styles.row}> 
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        setStartLocation(null);
                        setEndLocation(null);            
                        // unconditional for now...            
                        
                        let result = null;
                        // TODO fix impedance mismatch
                        if (tripType == "walking"){
                            result = completeChallenge("walk");
                        } else if (tripType == "public"){
                            result = completeChallenge("bus");
                            if (result == null){
                                result = completeChallenge("train");
                            }
                        } else if (tripType == "active"){
                            result = completeChallenge("bike");
                            if (result == null){
                                result = completeChallenge("scooter");
                            }                            
                        }
                        console.log("result:", result)
                        if (result != null){
                            navigation.navigate('Challenge Completed', {"tripType": tripType, "challenge": result});                    
                        } else {
                            console.log("No challenge completed this trip.")
                        }
                    }}>
                    <Text style={styles.buttonTitle}>{Math.round(Geography.distanceApproxDevice(startLocation, endLocation))/1000} km</Text>
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
            <Text style={styles.label}>You completed a challenge!</Text>
            {img({name: imageNameSelect(route.params.tripType), style:{width: "100%"}})}
            <Text style={styles.label}>{route.params.challenge}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    navigation.navigate("Start Journey");
                }}>
            <Text style={styles.buttonTitle}>Keep Travelling</Text>
          </TouchableOpacity>

        </View>
        </ImageBackground>
    );
}


export default JourneyScreen;