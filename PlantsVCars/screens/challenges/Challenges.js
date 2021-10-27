import React, {useContext, useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View, Dimensions, ImageBackground, LogBox, Touchable, TouchableOpacity} from 'react-native';
import moment from 'moment';
import {img} from "../../images/manifest"
import {createStackNavigator} from '@react-navigation/stack';
import Quiz from './BonusChallenges';
import userId from '../home/userId';
import {firebase} from "../settings/Firebase"
import { set } from 'react-native-reanimated';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/**
 * ChallengeScreen navigation
 */

const ChallengesScreenNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Challenges" component={ChallengesScreen}
                    options={{headerShown: false}}/>
      <Stack.Screen name="My Quiz" component={Quiz}/>
    </Stack.Navigator>
  )
}

/**
 * Constants for challenge selection and image.
 */

export const isCompleted = ["Cross", "Tick"]

export const ChallengeOptions = [
  {challenge: "Walk to work once this Week", completed: isCompleted[0], mode: "walk"},
  {challenge: "Take the bus to work once this week", completed: isCompleted[0], mode: "bus"},
  {challenge: "Take the train once this week", completed: isCompleted[0], mode: "train"},
  {challenge: "Ride a bike to work once this week", completed: isCompleted[0], mode: "bike"},
  {challenge: "Ride a scooter to work once this week", completed: isCompleted[0], mode: "scooter"},
];

/* The base rate reward and the challenge bonus reward */
export const Reward = 100;

export const scaleReward = (distance, mode) => {
  let distances = {walk: 1000, scooter: 2000, bike: 3000, bus: 5000, train: 8000}; //fibonacci
  // maybe an adjustment for level eventually?
  return Math.abs(Math.round(Reward * distance / distances[mode]));
}

const ChallengesScreen = ({navigation}) => {

  /**
   * Leveling system.
   */

  /**
   * save databased stored level.
   */
  const saveLevel = async () => {
    firebase.firestore().collection("users").doc(uid).update({
      level: level,
    })
  }

  /**
   * load database stored level.
   */
  const loadLevel = async () => {
    firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
      setLevel(doc.data().level);
    })
  }

  //--------------------------------------------------------------------------------

  /**
   * Code for current week and next week`127
   */

  /**
   * save database stored week.
   */
  const saveWeek = async () => {
    firebase.firestore().collection("users").doc(uid).update({
      currentWeek: storedWeek,
    })
  }

  /**
   * load database stored week.
   */
  const loadWeek = async () => {
    firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
      changeWeek(doc.data().currentWeek);
    })
  }

  //--------------------------------------------------------------------------------

  /**
   * Code for generating, storying and loading challenges.
   */

  

  /**
   * generate challenges from a pool.
   */

  const generateChallenges = () => {
    const selectableChallenges = ChallengeOptions.slice();
    const challengeList = [];
    var n = 4;
    while (n > 0) {
      var value = Math.floor(Math.random() * selectableChallenges.length);
      challengeList.push(selectableChallenges[value]);
      selectableChallenges.splice(value, 1);
      n = n - 1;
    }
    setChallenges(challengeList);
    firebase.firestore().collection("users").doc(uid).update({
      challenges: challenges,
    })
  }

  /**
   * load database stored challenges.
   */
  const loadChallenges = async () => {
    firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
      setChallenges(doc.data().challenges);
    })
  }

  const completeChallenge = (mode) => {
    let challengesTemp = [...challenges];
    for (let i = 0; i < challenges.length; i++) {
      if (challengesTemp[i].mode == mode) {
        challengesTemp[i].completed = isCompleted[1];
      }
    }
    setChallenges(challengesTemp);
    firebase.firestore().collection("users").doc(uid).update({
      challenges: challengesTemp
    });
    firebase.firestore().collection("users").doc(uid).update({
    });
  }

  /**
   * Set state when quiz is taken and send state to database.
   */
  const takeQuiz = (navigation) => {
    console.log(`Bonus Challenges Complete: ${bonusChallenge}`)
    if (bonusChallenge === false) {
      firebase.firestore().collection("users").doc(uid).update({
        bonusChallenge: true
      }).then()
      navigation.navigate('My Quiz');
      console.log("Navigating to bonus challenges")
    } else {
      alert("Quiz has already been completed this week")
    }
  }

  /**
   * Load state for quiz taken from database.
   */
  const loadQuiz = async () => {
    firebase.firestore().collection("users").doc(uid).onSnapshot(doc => {
      setBonusChallenge(doc.data().bonusChallenge);
    })
  }

  //--------------------------------------------------------------------------------

  /**
   * Variables for global storage using Async.
   */
  const [level, setLevel] = useState(1);
  const [bonusChallenge, setBonusChallenge] = useState(false);
  const [challenges, setChallenges] = useState(ChallengeOptions);
  const [storedWeek, changeWeek] = useState("2021-09-06T14:00:00.000Z");
  const uid = useContext(userId);
  //--------------------------------------------------------------------------------

  /**
   * Load all the globally stored data upon opening page upon entering page.
   */
  const updateWeeklyReset = () => {
    var currentWeek = moment().startOf('isoWeek').add(1, 'days');
    var previousWeek = moment(storedWeek);
    if (currentWeek.clone().subtract(7, 'days').isSameOrAfter(previousWeek)) {
      let thisWeek = JSON.stringify(currentWeek);
      firebase.firestore().collection("users").doc(uid).update({
        currentWeek: thisWeek
      })
      var challengesComplete = true;
      for (var i = 0; i < challenges.length; i++) {
        if (challenges[i].completed === isCompleted[0]) {
          challengesComplete = false;
        }
      }
      generateChallenges();
      if (challengesComplete && level < 3) {
        let newLevel = level + 1;
        setLevel(newLevel);
        firebase.firestore().collection("users").doc(uid).update({
          level: newLevel
        })
      } else if (!challengesComplete && level > 1) {
        let newLevel = level + 1;
        setLevel(newLevel);
        firebase.firestore().collection("users").doc(uid).update({
          level: {newLevel}
        })
      }
      firebase.firestore().collection("users").doc(uid).update({
        bonusChallenge: false,
      })
      changeWeek(newWeek);
    }
  }

  /**
   * Handles time update for loading database items and weekly reset.
   */
  useEffect(() => {
    if (storedWeek === "2021-09-06T14:00:00.000Z") {
      var thisWeek = moment().startOf('isoWeek').add(1, 'days');
      changeWeek(thisWeek);
      firebase.firestore().collection("users").doc(uid).update({
        currentWeek: JSON.stringify(thisWeek)
      })
    }
    const interval = setInterval(() => {
      updateWeeklyReset();
    }, 500)
    return () => clearInterval(interval)
  }, [storedWeek]);

  useEffect(() => {
    loadLevel();
    loadWeek();
    loadChallenges();
    loadQuiz();
  }, [])

  /**
   * View screen
   */
  if (level === 1) {
    return (
      <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}>
        <View style={styles.container}>
          <Text style={styles.level}> Level {level}</Text>
          <Text style={styles.headings1}> Challenges </Text>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[0].challenge).substring(1, JSON.stringify(challenges[0].challenge).length - 1)}
            </Text>
            {img({name: challenges[0].completed, style: styles.plantTile})}
          </View>
          <ImageBackground source={require('../../images/bg/bonus.png')} style={{flex:1, width:"100%", height:"100%", }}>
          <View style={styles.container}>
            <Text style={styles.headings2}> Bonus Challenges </Text>
            <TouchableOpacity
                style = {{height: 48, borderRadius: 5, backgroundColor: 'tomato', width: '50%', display: 'flex', alignItems: 'center'}}
                onPress={() => takeQuiz(navigation)}>
                <Text style={styles.challengeText2}>Take Quiz</Text>
            </TouchableOpacity>
            {bonusChallenge ?
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[1], style: styles.plantTile})}
            </View> :
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[0], style: styles.plantTile})}
            </View>}
          </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    )
  } else if (level === 2) {
    return (
      <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}>
        <View style={styles.container}>
          <Text style={styles.level}> Level {level}</Text>
          <Text style={styles.headings1}> Challenges </Text>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[0].challenge).substring(1, JSON.stringify(challenges[0].challenge).length - 1)}
            </Text>
            {img({name: challenges[0].completed, style: styles.plantTile})}
          </View>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[1].challenge).substring(1, JSON.stringify(challenges[1].challenge).length - 1)}
            </Text>
            {img({name: challenges[1].completed, style: styles.plantTile})}
          </View>
          <ImageBackground source={require('../../images/bg/bonus.png')} style={{flex:1, width:"100%", height:"100%", }}>
          <View style={styles.container}>
            <Text style={styles.headings2}> Bonus Challenges </Text>
            <TouchableOpacity
                style = {{height: 48, borderRadius: 5, backgroundColor: 'rgba(1, 0, 0, 0.5)', width: '50%', display: 'flex', alignItems: 'center'}}
                onPress={() => takeQuiz(navigation)}>
                <Text style={styles.challengeText2}>Take Quiz</Text>
            </TouchableOpacity>
            {bonusChallenge ?
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[1], style: styles.plantTile})}
            </View> :
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[0], style: styles.plantTile})}
            </View>}
          </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    )
  } else if (level === 3) {
    return (
      <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}>
        <View style={styles.container}>
          <Text style={styles.level}> Level {level}</Text>
          <Text style={styles.headings1}> Challenges </Text>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[0].challenge).substring(1, JSON.stringify(challenges[0].challenge).length - 1)}
            </Text>
            {img({name: challenges[0].completed, style: styles.plantTile})}
          </View>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[1].challenge).substring(1, JSON.stringify(challenges[1].challenge).length - 1)}
            </Text>
            {img({name: challenges[1].completed, style: styles.plantTile})}
          </View>
          <View style={styles.challengeContainer}>
            <Text
              style={styles.challengeText1}> {JSON.stringify(challenges[2].challenge).substring(1, JSON.stringify(challenges[2].challenge).length - 1)}
            </Text>
            {img({name: challenges[2].completed, style: styles.plantTile})}
          </View>
          <ImageBackground source={require('../../images/bg/bonus.png')} style={{flex:1, width:"100%", height:"100%", }}>
          <View style={styles.container}>
            <Text style={styles.headings2}> Bonus Challenges </Text>
            <TouchableOpacity
                style = {{height: 48, borderRadius: 5, backgroundColor: 'rgba(1, 0, 0, 0.5)', width: '50%', display: 'flex', alignItems: 'center'}}
                onPress={() => takeQuiz(navigation)}>
                <Text style={styles.challengeText2}>Take Quiz</Text>
            </TouchableOpacity>
            {bonusChallenge ?
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[1], style: styles.plantTile})}
            </View> :
            <View style={styles.challengeContainer}>
              <Text style={styles.challengeText2}> Quiz Completion: </Text>
              {img({name: isCompleted[0], style: styles.plantTile})}
            </View>}
          </View>
          </ImageBackground>
        </View>
      </ImageBackground>
    )
  }

  // return (
  //   <ImageBackground source={require('../../images/bg/challengesbg.png')} style={{flex:1, width:"100%", height:"100%"}}>
  //     <View style={styles.container}>
  //       <Text style={styles.level}> Level {level}</Text>
  //       <Text style={styles.headings1}> Challenges </Text>
  //       {challenges.map(({challenge, completed}) => (
  //         <View style={styles.challengeContainer}>
  //           <Text
  //             style={styles.challengeText1}> {JSON.stringify(challenge).substring(1, JSON.stringify(challenge).length - 1)}
  //           </Text>
  //           {img({name: completed, style: styles.plantTile})}
  //         </View>
  //       ))}
}

//--------------------------------------------------------------------------------

/**
 * Styling code
 */

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    flex: 1,
    opacity: 1,
    textAlign: 'right',
    alignItems: 'center',
  },
  level: {
    fontFamily: 'PressStart2P',
    fontSize: 15,
    color: 'darkgreen',
    paddingTop: 15,
    fontWeight: 'bold',
  },
  headings1: {
    fontFamily: 'PressStart2P',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'darkgreen',
    paddingTop: 15,
    paddingBottom: 15,
  }, headings2: {
    fontFamily: 'PressStart2P',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'maroon',
    paddingTop: 15,
    paddingBottom: 15,
  },
  challenges: {
    fontSize: 15,
  },
  challengeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '70%',
  },
  challengeText1: {
    fontFamily: 'PressStart2P',
    fontSize: 15,
    color: 'darkgreen',
    paddingTop: 20,
    paddingBottom: 20,
  }, challengeText2: {
    fontFamily: 'PressStart2P',
    fontSize: 15,
    color: 'maroon',
    paddingTop: 20,
    paddingBottom: 20,
  }, plantTile: {
    marginTop: 15,
    height: "8%",
    width: "8%",
    margin: "4%",
    aspectRatio: 1,
  },  overallBG: {
    height: windowHeight,
    width: windowWidth
  }
})

export default ChallengesScreenNav;
