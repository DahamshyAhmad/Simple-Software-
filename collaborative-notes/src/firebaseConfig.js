import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD66EsZoSbgbY5t8CzzgiECMGPUNgh1Zds",
    authDomain: "simple-software-ahmad.firebaseapp.com",
    projectId: "simple-software-ahmad",
    storageBucket: "simple-software-ahmad.appspot.com",
    messagingSenderId: "947119972069",
    appId: "1:947119972069:web:7a2c74c111bfc6dd133e0c",
    measurementId: "G-FT3TRQQN0M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, serverTimestamp };
