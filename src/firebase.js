import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCFG_yrr13uuqW5IjfHaaKFZX16i4CtANQ",
    authDomain: "feedback-360-79541.firebaseapp.com",
    projectId: "feedback-360-79541",
    storageBucket: "feedback-360-79541.appspot.com",
    messagingSenderId: "500369647776",
    appId: "1:500369647776:web:78c58c3f4116fff27a41c5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };