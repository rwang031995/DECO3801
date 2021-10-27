import firebase from "firebase";
import "@firebase/firestore"

/**
 * Database related code
 */

export async function setFirebaseValue(uid, key, value){
    let updateObj = new Object;
    updateObj[key] = value;
    firebase.firestore().collection("users").doc(uid).update(updateObj);
}

export async function getFirebaseValue(uid, key){
    return (await (await firebase.firestore().collection("users").doc(uid).get()).data())[key];
}

export async function updateCurrencyBalance(uid, amount){
    let balance = await getFirebaseValue(uid, 'currency');
    setFirebaseValue(uid, 'currency', parseInt(balance) + amount);
}

const firebaseConfig = {
    apiKey: "AIzaSyDJl3MrUg4-9ZPBgcCqWmdpZb6mNQ5fSS4",
    authDomain: "plantsvcars-da4c6.firebaseapp.com",
    projectId: "plantsvcars-da4c6",
    storageBucket: "plantsvcars-da4c6.appspot.com",
    messagingSenderId: "574300473583",
    appId: "1:574300473583:web:d46f97b7ed98e94c73731a",
    measurementId: "G-WYRZYMVC68"
  };
  
if (!firebase.apps.length) {
 firebase.initializeApp(firebaseConfig)
}

export {firebase}
