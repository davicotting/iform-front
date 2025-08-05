import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoMMru6DMBvPIT8Gn2rRf0hm4UIDhM8YQ",
  authDomain: "iform-f3ecf.firebaseapp.com",
  projectId: "iform-f3ecf",
  storageBucket: "iform-f3ecf.firebasestorage.app",
  messagingSenderId: "829267405869",
  appId: "1:829267405869:web:6eb64e1e78650a117c1ca4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
