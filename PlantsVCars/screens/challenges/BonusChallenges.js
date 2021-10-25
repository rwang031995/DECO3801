import React, {useContext, useEffect, useState} from "react";
import {
  Alert, BackHandler,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {questions} from "./BonusQuestionPool";
import {getStorage, setStorage} from "../settings/Storage";
import {firebase} from "../settings/Firebase";
import userId from "../home/userId";

const NUM_OF_QUESTIONS = 3

const STORAGE_KEYS = {
  bonusChallengesScore: "Bonus challenges score",
  bonusChallengesComplete: "Bonus Challenges Complete",
  challengesReset: "Reset Challenges",
  bonusChallengeQuestions: "Bonus Challenge Questions"
}

export const writeScore = (score) => {
  setStorage(STORAGE_KEYS.bonusChallengesScore, score).then(r => {
  })
}

export const readScore = () => {
  return getStorage(STORAGE_KEYS.bonusChallengesScore)
}

const writeBonusChallengesComplete = (bool) => {
  setStorage(STORAGE_KEYS.bonusChallengesComplete, bool).then(r => {
  })
}

/**
 * Displays current question and the list of answers on the screen.
 * Sends score back to the Quiz component to track score
 *
 * @param props - set of props from quiz component
 * @returns {JSX.Element}
 * @constructor
 */
const QuesAnsPair = (props) => {
  /**
   */
  const [selected, setSelected] = useState({})
  const [score, setScore] = useState({})

  /**
   * Handles the next question to be displayed.
   * @param selectedAns - The current answer selected
   * @param achievedScore - The score of the selected answer
   * @returns {Promise<void>}
   */
  const handleNext = async (selectedAns, achievedScore) => {
    setSelected({...selected, [props.qIndex]: selectedAns})
    setScore({...score, [props.qIndex]: achievedScore})
    props.setShowNext(true)
  }


  // Add up all the scores in score state and write the final score to the
  // quiz component
  let finalScore
  useEffect(() => {
    let arr = Object.values(score)
    let temp = 0
    for (let i = 0; i < arr.length; i++) {
      temp = temp + arr[i]
    }

    finalScore = temp
    // console.log(finalScore)
    props.setScore(finalScore)
    props.setSelected(selected)
  }, [score, props.qIndex])

  return (
    <>
      <View style={styles.questionContainer}>
        <Text>
          Score: {props.updatedScore}
        </Text>
        <Text style={styles.questionIndex}>
          Question {props.qIndex + 1}/{props.numQuestions}
        </Text>
        <Text style={styles.questionText}>
          {props.question["questionText"]}
        </Text>
      </View>
      {/*<View style={styles.selectedAnswerContainer}>*/}
      {/*  <Text style={styles.selectedAnswer}>*/}
      {/*    Selected Answer: {selected[props.qIndex] === undefined ?*/}
      {/*    null : selected[props.qIndex]}*/}
      {/*  </Text>*/}
      {/*</View>*/}
      <View style={styles.answersContainer}>
        {
          props.question["answers"].map((answer, i) => {
            return (
              <TouchableOpacity
                style={[styles.answer,
                  selected[props.qIndex] === answer["text"] ?
                    styles.highlightedAnswer : null
                ]}
                key={i}
                onPress={handleNext.bind(this, answer["text"],
                  answer["correct"] === true ? 1 : 0)}
              >
                <View>
                  <Text style={styles.answerText}>
                    {answer["text"]}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          })
        }
      </View>
    </>
  )
}

/**
 * Quiz component for the bonus challenges. Handles getting the next
 * question after confirming an answer.
 *
 * @param props - navigation
 * @returns {JSX.Element}
 * @constructor
 */
const Quiz = (props) => {
  const [qIndex, setQIndex] = useState(0)
  const [showNext, setShowNext] = useState(false)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState({})
  const [updatedScore, setUpdateScore] = useState(0)
  const [myQuestions, setMyQuestions] = useState([])

  const uid = useContext(userId)

  const loadQuestions = () => {

    const nums = new Set()
    let arr = []

    while (nums.size !== NUM_OF_QUESTIONS) {
      nums.add(Math.floor(Math.random() * questions.length))
    }

    // console.log(nums)

    for (let i = 0; i < nums.size; i++) {
      // console.log(questions[Array.from(nums)[i]])
      arr.push(questions[Array.from(nums)[i]])
    }

    // console.log(arr)

    setMyQuestions(myQuestions => arr)

  }

  if (myQuestions.length !== 3) {
    loadQuestions()
  }

  // console.log(myQuestions)

  const handle_question = () => {
    // console.log(`Score: ${score}`)
    writeScore(score)
    writeBonusChallengesComplete(true)
    if (score > updatedScore) {
    }
    setUpdateScore(score)
    setQIndex(qIndex => qIndex + 1)
    // if (qIndex === myQuestions.length - 1) {
    //   props.navigation.navigate("Challenges", {score: score})
    //   return
    // }
    setShowNext(false)
  }

  useEffect(() => {

    const backAction = () => {
      console.log(qIndex)
      if (qIndex < myQuestions.length) {
        Alert.alert("Wait!", "Are you sure you want to go leave? All" +
          " progress on the quiz will be lost!", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => props.navigation.pop() }
        ]);
        return true;
      }
      firebase.firestore().collection("users").doc(uid).get().then(doc => {
        firebase.firestore().collection("users").doc(uid).update({
          currency: doc.data().currency + score * 60
        }).then()
      })
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [qIndex]);

  return (
    qIndex < myQuestions.length ?
      <View style={styles.screen}>
        <QuesAnsPair
          qIndex={qIndex}
          question={myQuestions[qIndex]}
          setShowNext={setShowNext}
          setScore={setScore}
          numQuestions={myQuestions.length}
          setSelected={setSelected}
          updatedScore={updatedScore}
          handle_question={handle_question}
        />
        <View style={styles.buttonContainer}>
          {/*<View style={styles.backButton}>*/}
          {/*  {*/}
          {/*    // Keep Back button on for easy testing. Will remove in final*/}
          {/*    // version*/}
          {/*    showNext && qIndex > 0 || (qIndex > 0) ?*/}
          {/*      <Button*/}
          {/*        title="Back"*/}
          {/*        onPress={() => setQIndex((index) => index - 1)}*/}
          {/*      /> : null*/}
          {/*  }*/}
          {/*</View>*/}
          <View>
            {
              showNext || selected[qIndex] !== undefined ?
                <View style={styles.confirmButton}>
                  <Button
                    title={"confirm"}
                    onPress={handle_question}/>
                </View> : null
            }
          </View>
        </View>
      </View> :
      <View>
        <Text style={styles.questionText}>
          Your score is: {score}
        </Text>
      </View>
  )
}

const colors = {
  primary: "black",
  accent: "white",
  accentSecondary: "white",
  background: "white",
  highlightedAnswer: "lightblue"
}


const styles = StyleSheet.create({
  questionContainer: {
    margin: 20,
    backgroundColor: colors.accent,
    padding: 15,
    borderRadius: 40,
    borderColor: colors.primary,
    borderWidth: 2,
    // minHeight: '20%'
  },
  questionIndex: {
    textAlign: 'center',
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    color: colors.primary
  },
  questionText: {
    fontSize: 20,
    textAlign: 'center',
    color: colors.primary,
  },
  answersContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  answer: {
    backgroundColor: colors.accentSecondary,
    padding: 10,
    width: '90%',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary
  },
  highlightedAnswer: {
    backgroundColor: colors.highlightedAnswer
  },
  answerText: {
    fontSize: 14,
  },
  selectedAnswer: {
    fontSize: 14,
    color: colors.primary,
  },
  selectedAnswerContainer: {
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center"
  },
  confirmButton: {
    justifyContent: "center",
    backgroundColor: colors.primary,
    // color: colors.primary
  },
  backButton: {
    flexDirection: "row",
    marginRight: 10,
    color: colors.primary
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1
  },
  scorePage: {
    backgroundColor: colors.background,
    flex: 1
  }

})

export default Quiz