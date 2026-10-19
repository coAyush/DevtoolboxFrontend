// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDiJww0bOZKTOJJVXyjv4R08nPoxtnRKto",
    authDomain: "devtoolbox-91200.firebaseapp.com",
    projectId: "devtoolbox-91200",
    storageBucket: "devtoolbox-91200.firebasestorage.app",
    messagingSenderId: "1034912653854",
    appId: "1:1034912653854:web:c1f848674261e5a6a7c40f",
    measurementId: "G-E06P9LF017"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);
export { app, messaging };