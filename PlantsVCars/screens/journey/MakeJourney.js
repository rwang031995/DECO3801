import {Text, View, Button, Image, StyleSheet, Dimensions, TouchableOpacity, ImageBackground, Alert, Animated} from "react-native";
import React, {useState, useEffect, createContext, useContext} from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from '@react-navigation/stack';
import * as Location from 'expo-location';
import {img} from "../../images/manifest"
import MapView, {Marker} from 'react-native-maps';
import * as Geography from "./Geography";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: "column"
  },
  icon: {
    width: 20,
    height: 20,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: '33%'
  },
  bg: {
    width: '100%',
    height: '100%',
  },
  input: {
    fontSize: 20,
    width: '60%',
    borderRadius: 5,
    backgroundColor: 'lightgrey',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  itemIcon: {
    justifyContent: "center",
    width: "33%",
    height: "33%",
    padding: "0%",
    marginTop: "2%",
    marginLeft: "auto",
    marginRight: "auto"
  },
  label: {
    fontSize: 10,
    justifyContent: 'center',
    marginLeft: "auto",
    marginRight: "auto",
  }
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

const JourneyScreen = () => {
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
                        style = {styles.bg}
                        showsUserLocation = {true}
                        pitchEnabled = {false}
                />
            <View style={styles.row}>
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
                {img({name: "PublicTransportIcon", style:styles.bg})}
                <Text style={styles.label}>Public Transport</Text>
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
                {img({name: "WalkingIcon", style:styles.bg})}
                <Text style={styles.label}>Walking</Text>
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
                {img({name: "ActiveTransportIcon", style:styles.bg})}
                <Text style={styles.label}>Bike or Scooter</Text>
                </TouchableOpacity>
            </View>
            <Text>Start Your Journey...</Text>
            </View>        
        )
    } else if (((startLocation !== null) && (endLocation == null))) {
        // Mid trip display
    //                         image={{uri: "../images/"+imageNameSelect(tripType)+'.png'}}

        return (
        <View style={styles.container}>
                <MapView 
                    style = {styles.bg}
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
            <View style={styles.row}>
                {img({name: imageNameSelect(tripType), style:styles.itemIcon})}
                <Button title="I'm there!" 
                    onPress = {async () => {
                        let location = await currentPositionAsync();
                        setEndLocation(location);
                        // evaluate trip type
                        
                        // we tested that they got on PT, so we'll trust that they got off OK
                        
                        // sanity check for walking - less than 10 km/h average
                        
                        // sanity check for active - less than 40 km/h average 
                        
                        // update challenge?
                    }}
                    style = {styles.itemIcon}
                />
            </View>
        </View>
        )
    } else if (endLocation !== null) {
        // 
        return (        
            <View style={styles.container}>
                <MapView 
                    style = {styles.bg}
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
            <View style={styles.row}>
                <Text>Time spent: {timeParse(startLocation.timestamp, endLocation.timestamp)}</Text>
                <Text>Distance travelled: {Math.round(Geography.distanceApproxDevice(startLocation, endLocation))} metres</Text>
                <Button title = "Dismiss"
                    onPress = { () => {
                        setStartLocation(null);
                        setEndLocation(null);
            
                        // unconditional for now...            
                        navigation.navigate('Challenge Completed', {"tripType": tripType});
                        
                    }}
                />
            </View>
            </View>
        )
    }
}

const ChallengeCompletedScreen = ({ navigation, route }, tripType) => {
    return (
        <View style={styles.container}>
            {img({name: imageNameSelect(route.params.tripType), style:{width: "100%"}})}
            <Text>🎉 🎉 🎉 You completed a challenge! 🎉 🎉 🎉</Text>
            <Button title="Continue" 
                onPress = {() => {
                    navigation.navigate('Start Journey')                    
                }}
            />
        </View>
    );
}


export default JourneyScreen;