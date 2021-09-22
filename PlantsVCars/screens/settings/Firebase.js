import firebase from 'firebase';
import { } from 'firebase/database';

/**
 * Database related code
 */

 const fire = firebase.initializeApp({
  apiKey: "AIzaSyDFRSuBssDX7_VN2czC2Itd6psF-lRRqDY",
  authDomain: "plantsvcars-6ab45.firebaseapp.com",
  databaseURL: "https://plantsvcars-6ab45-default-rtdb.firebaseio.com",
  projectId: "plantsvcars-6ab45",
  storageBucket: "plantsvcars-6ab45.appspot.com",
  messagingSenderId: "90613998724",
  appId: "1:90613998724:web:276ec830951bcbc48e8ed1",
  measurementId: "G-693KFN0ZNZ"
});

export const auth = fire.auth();
export const database = fire.database();
export default {
    fire,
}
