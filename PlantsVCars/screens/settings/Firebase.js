import firebase from "firebase";
import "@firebase/firestore"

/**
 * Database related code
 */


const firebaseConfig = {
    apiKey: "AIzaSyDHUYYfX5uqLLREOMpZofXDZQOlyM46Ms8",
    authDomain: "plantsvcars-17913.firebaseapp.com",
    projectId: "plantsvcars-17913",
    storageBucket: "plantsvcars-17913.appspot.com",
    messagingSenderId: "430978613166",
    appId: "1:430978613166:web:197b9abe9889fc170b123f",
    measurementId: "G-KK5KYD3GS0"
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
