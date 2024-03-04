import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBB4Anl0abMsSD8bu-9z16VMKoiS04ti50",
  authDomain: "community-marketplace-ac051.firebaseapp.com",
  projectId: "community-marketplace-ac051",
  storageBucket: "community-marketplace-ac051.appspot.com",
  messagingSenderId: "494703196251",
  appId: "1:494703196251:web:0042cc595eabb0b487277e",
  measurementId: "G-MSW0L7P7M9"
};

export const app = initializeApp(firebaseConfig);