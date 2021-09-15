import React, {useEffect, useState} from "react";
import {getStorage, setStorage, STORAGE_KEY} from "../settings/Storage";

import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator()

const BonusChallengesButtons = ({navigation}) => {

  const [answeredState, setAnsweredState] = useState([
    false, false, false
  ])
  const [correctState, setCorrectState] = useState([
    false, false, false
  ])

  useEffect(() => {
    for (let i = 0; i < questions.length; i++) {
      let storageKey = STORAGE_KEY.bonusChallenges[i]
      getStorage(storageKey.answered, setAnsweredState)
      getStorage(storageKey.correct, setCorrectState)
    }
  }, [])

  return (
    <ScrollView>
      {questions.map(({question}) => (
        <View key={question}>
          <TouchableOpacity
            key={question}
            onPress={() => {
              navigation.navigate(question, {question})
            }}
          >
            <Text style={styles.question}>
              {question}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  )
}

const BonusChallengesNav =() => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={"BonusChallengesButton"}
        component={BonusChallengesButtons}
      />
      {/*<Stack.Screen*/}
      {/*  name={"BonusChallenges"}*/}
      {/*  component={BonusChallenges}/>*/}
      <Stack.Screen
        name={questions[0].question}
        children={() => (
          <QuestionScreen
            questionIndex={0}
            key={questions[0].question}
          />
        )}
      />
      <Stack.Screen
        name={questions[1].question}
        children={() => (
          <QuestionScreen
            questionIndex={1}
            key={questions[1].question}
          />
        )}
      />
      <Stack.Screen
        name={questions[2].question}
        children={() => (
          <QuestionScreen
            questionIndex={2}
            key={questions[2].question}
          />
        )}
      />
    </Stack.Navigator>
  )
}

const QuestionScreen = ({questionIndex}) => {

  const [correctState, setCorrectState] = useState(false)
  const [answeredState, setAnsweredState] = useState(false)

  // console.log(questionIndex)

  const question= questions[questionIndex]

  // console.log(question)

  console.log(question.question)

  const handleAnswer = (correct) => {

    if (!answeredState) {
      setCorrectState(
        correctState => !!correct
      )
      setAnsweredState(answeredState => true)
    }
    console.log(`correct: ${correctState}`)
    console.log(`answered: ${answeredState}`)
  }

  let storageKey = STORAGE_KEY.bonusChallenges[questionIndex]

  useEffect(() => {
    console.log(storageKey)
    setStorage(storageKey.answered, answeredState)
    setStorage(storageKey.correct, correctState)
  },[answeredState, correctState])

  useEffect(() => {
    getStorage(storageKey.answered, setAnsweredState)
    getStorage(storageKey.correct, setCorrectState)
  })

      return (
        <View>
          <Text
            style={styles.question}
          >
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
      )
}


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
  )
}

const BonusChallenges = ({navigation}) => {

  const [state, setState] = useState({
    correctCount: 0,
    totalCount: questions.length,
    activeQuestionIndex: 0,
    answered: [false, false, false],
    answerCorrect: [false, false, false]
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

  // const nextQuestion = (nextState) => {
  //   console.log("next Question")
  //     setState(
  //       state => {
  //         const nextIndex = state.activeQuestionIndex + 1;
  //
  //         console.log(nextIndex)
  //
  //         if (nextIndex >= state.totalCount) {
  //           return navigation.popToTop()
  //         }
  //
  //         return {
  //           activeQuestionIndex: nextIndex,
  //           answered: false
  //         }
  //     })
  // }

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
    question: "What is a greenhouse gas?",
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

export default BonusChallengesNav