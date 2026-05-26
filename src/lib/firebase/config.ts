// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxU5yxOKDSWGulMH1egkbnm_xb4bCS9zA",
  authDomain: "icg-a02b9.firebaseapp.com",
  projectId: "icg-a02b9",
  storageBucket: "icg-a02b9.firebasestorage.app",
  messagingSenderId: "443710966860",
  appId: "1:443710966860:web:2f35e16952eb34f74e38e9",
  measurementId: "G-DKDJTDPSM4",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
