import React, {useEffect, useState} from "react";
import {getSettings, setSetting, STORAGE_KEY} from "../settings/Storage";

import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {StackActions} from "react-navigation";

const BonusChallengesComponent = ({questions, state, handleAnswer}) => {

  const question = questions[state.activeQuestionIndex]

  console.log(state)

  return (

    <View>
      <View>
        <Text style={styles.question}>
          {question.question}
        </Text>

        <View
          style={styles.buttonContainer}
        >
          {question.answers.map(answer => (
            <Button
              key={answer.id}
              title={answer.text}
              onPress={() => handleAnswer(answer.correct)}
            />

          ))}

        </View>
      </View>
    </View>

    // <ScrollView>
    //   {challenges.map(({question, onPress}) => (
    //     <View key={question}>
    //       <TouchableOpacity
    //         onPress={onPress}
    //         style={styles.touchableOpacity}>
    //         <View style={styles.container}>
    //           <Text style={styles.question}>
    //             {question}
    //           </Text>
    //         </View>
    //
    //       </TouchableOpacity>
    //     </View>
    //   ))}
    // </ScrollView>
  )
}

const BonusChallenges = ({navigation}) => {

  const [state, setState] = useState({
    correctCount: 0,
    totalCount: questions.length,
    activeQuestionIndex: 0,
    answered: false,
    answerCorrect: false
  })

  const answer = (correct) => {
    setState(
      state => {
        const nextState = {
          totalCount: state.totalCount,
          answered: true,
        }

        if (correct) {
          nextState.correctCount = state.correctCount + 1;
          nextState.answerCorrect = true;
        } else {
          nextState.answerCorrect = false;
        }

        const nextIndex = state.activeQuestionIndex + 1;

        if (nextIndex >= state.totalCount) {
          console.log("pop to top")
          return navigation.pop
        }

        nextState.activeQuestionIndex = nextIndex

        return nextState
      }
    )
  }

  const nextQuestion = (nextState) => {
    console.log("next Question")
      setState(
        state => {
          const nextIndex = state.activeQuestionIndex + 1;

          console.log(nextIndex)

          if (nextIndex >= state.totalCount) {
            return navigation.popToTop()
          }

          return {
            activeQuestionIndex: nextIndex,
            answered: false
          }
      })
  }

  return (
    <BonusChallengesComponent
      questions={questions}
      state={state}
      handleAnswer={answer}
    />
  )
}

const questions = [

  /* Questions:
   https://learninglink.oup.com/access/content/wetherly_otter4e-student-resources/wetherly_otter4e-chapter-8-multiple-choice-questions
   */

  {
    question: "Which of the following is not a greenhouse gas?",
    answers: [
      { id: "1", text: "Methane" },
      { id: "2", text: "Hydrogen", correct: true },
      { id: "3", text: "Carbon Dioxide" },
      { id: "4", text: "Nitrous Oxide" }
    ]
  },
  {
    question: "What is the average yearly C02 emission in Australia?",
    answers: [
      { id: "1", text: "Methane" },
      { id: "2", text: "Hydrogen", correct: true },
      { id: "3", text: "Carbon Dioxide" },
      { id: "4", text: "Nitrous Oxide" }
    ]
  },
  {
    question: "What is the average yearly C02 emission in Australia?",
    answers: [
      { id: "1", text: "Methane" },
      { id: "2", text: "Hydrogen", correct: true },
      { id: "3", text: "Carbon Dioxide" },
      { id: "4", text: "Nitrous Oxide" }
    ]
  }
]

const styles = StyleSheet.create({
  question: {
    fontSize: 18
  },
  touchableOpacity: {
    flex: 1
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "space-between"
  }
})

export default BonusChallenges