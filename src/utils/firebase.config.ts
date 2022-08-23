// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDvCYyzkMCIrKfn-OC7UDBMdy95L6OxYsg",
  authDomain: "blogify-241f1.firebaseapp.com",
  projectId: "blogify-241f1",
  storageBucket: "blogify-241f1.appspot.com",
  messagingSenderId: "378769754651",
  appId: "1:378769754651:web:efa15cd7d0a3cd03f946be",
  measurementId: "G-62H8K9L1FQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
