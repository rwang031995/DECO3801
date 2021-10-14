import firebase from "firebase";
import "@firebase/firestore"

/**
 * Database related code
 */

const firebaseConfig = {
  apiKey: "AIzaSyDFRSuBssDX7_VN2czC2Itd6psF-lRRqDY",
  authDomain: "plantsvcars-6ab45.firebaseapp.com",
  databaseURL: "https://plantsvcars-6ab45-default-rtdb.firebaseio.com",
  projectId: "plantsvcars-6ab45",
  storageBucket: "plantsvcars-6ab45.appspot.com",
  messagingSenderId: "90613998724",
  appId: "1:90613998724:web:276ec830951bcbc48e8ed1",
  measurementId: "G-693KFN0ZNZ"
};
   
// const firebaseConfig = {
//  apiKey: "AIzaSyDpXBMJkITPHT0zqfe_pOA8XgXP7ba7_UE",
//  authDomain: "plantsvscars-26ad0.firebaseapp.com",
//  databaseURL: "https://plantsvscars-26ad0-default-rtdb.firebaseio.com",
//  projectId: "plantsvscars-26ad0",
//  storageBucket: "plantsvscars-26ad0.appspot.com",
//  messagingSenderId: "857742504179",
//  appId: "1:857742504179:web:eae1227c852f29a3f44786",
//  measurementId: "G-WRPQE0R2B5"
// };

if (!firebase.apps.length) {
 firebase.initializeApp(firebaseConfig)
}

export {firebase}
