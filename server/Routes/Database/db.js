import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC3FqaUTNeMtLrKH0MAD37g1c94vaBZCls",
  authDomain: "lawflow-fac30.firebaseapp.com",
  projectId: "lawflow-fac30",
  storageBucket: "lawflow-fac30.firebasestorage.app",
  messagingSenderId: "285597076297",
  appId: "1:285597076297:web:5fc622b065b7e67edda898"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

