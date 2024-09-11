// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-manager-c9dda.firebaseapp.com",
  projectId: "task-manager-c9dda",
  storageBucket: "task-manager-c9dda.appspot.com",
  messagingSenderId: "252343493674",
  appId: "1:252343493674:web:15f42600d70c7ce99e8f53",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
