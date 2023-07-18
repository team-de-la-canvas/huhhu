import StateProvider from "./src/providers/StateProvider";
import * as React from 'react';
import Root from "./src/Root";
import FlashMessage from "react-native-flash-message";
import {Image} from "react-native";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALKiolAF1WBPuYP7jQYWK-D5Urd3q7KSg",
    authDomain: "huhhu-6040d.firebaseapp.com",
    projectId: "huhhu-6040d",
    storageBucket: "huhhu-6040d.appspot.com",
    messagingSenderId: "892413440904",
    appId: "1:892413440904:web:14d5ef45ac61872b01403d",
    measurementId: "G-ZX87T0F9V8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const App = () =>
    <StateProvider>
        <Root/>
        <FlashMessage position="top" />
    </StateProvider>
export default App;
