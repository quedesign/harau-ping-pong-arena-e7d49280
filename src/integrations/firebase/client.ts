// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmuyoW4RnXMckAp_vfHc0v5OGIjgeT9dM",
  authDomain: "harau-aec04.firebaseapp.com",
  databaseURL: "https://harau-aec04-default-rtdb.firebaseio.com",
  projectId: "harau-aec04",
  storageBucket: "harau-aec04.appspot.com",
  messagingSenderId: "671038217017",
  appId: "1:671038217017:web:540922ef3d0e00796dd26b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);