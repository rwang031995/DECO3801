import firebase from "firebase";
import "@firebase/firestore"

/**
 * Database related code
 */



const firebaseConfig = {
    apiKey: "AIzaSyCR5WDI8njkxgAJ67fZbhLx07gO6dy0eK0",
    authDomain: "plantsva-429e2.firebaseapp.com",
    projectId: "plantsva-429e2",
    storageBucket: "plantsva-429e2.appspot.com",
    messagingSenderId: "1001065166477",
    appId: "1:1001065166477:web:9968b8cf3e3ed9668114c4",
    measurementId: "G-5EZJFLMLTE"
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
