import {Alert, Text, View} from "react-native";
import Leaderboard from "react-native-leaderboard";
import React, {useEffect, useState} from "react";
import {firebase} from "../settings/Firebase";

const PvCLeaderboard = () => {

  const [data, setData] = useState([])

  alert = (title, body) => {
    Alert.alert(title, body, [{
      text: "OK", onPress: () => {
      }
    }], {
      cancelable: false
    });
  };

  useEffect(() => {

    const leaderboardDb = firebase.firestore().collection("leaderboard")

    leaderboardDb
      .orderBy("score")
      .limit(10)
      .get().then(col => {
      let arr = []
      col.docs.map(doc => arr.push({
        name: doc.id,
        score: doc.data().score
      }))
      setData(arr)
    })

  }, [])

  const props = {
    labelBy: "name",
    sortBy: "score",
    data: data,
    icon: "iconUrl",
    onRowPress: (item, index) => {
      alert(item.name + " clicked", item.score + " points, wow!");
    },
    evenRowColor: "#edfcf9"
  };

  return (
    <View style={{flex: 1}}>
      {/*<View*/}
      {/*  style={{*/}
      {/*    paddingTop: 50,*/}
      {/*    backgroundColor: "black",*/}
      {/*    alignItems: "center"*/}
      {/*  }}*/}
      {/*>*/}
      {/*  /!*<Text style={{fontSize: 30, color: "white", paddingBottom: 10}}>*!/*/}
      {/*  /!*  Leaderboard*!/*/}
      {/*  /!*</Text>*!/*/}
      {/*</View>*/}
      <Leaderboard {...props} />
    </View>
  );
}

export default PvCLeaderboard;