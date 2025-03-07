const express = require('express');
const { doc, setDoc, getFirestore } = require("firebase/firestore");
const bcrypt = require('bcrypt');
const { initializeApp }  =require("firebase/app");
const newuser = express.Router();

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

newuser.post('/new-user', async(req,res) =>{

    console.log(req.body);

    bcrypt.hash(req.body.number, 10, function(err, hash) {

        bcrypt.compare(req.body.number, hash, function(err, result) {
            if(result==true)
            {
                res.send(hash);
            }
        });
    });

    

    

    await setDoc(doc(db, "users", req.body.number), {
        number: req.body.number,
        posts: []
    });

})

newuser.get('/logout', async(req, res)=>{
    localStorage.removeItem("auth");
})



newuser.post('/check-user', async(req,res) =>{

    const docRef = doc(db, "users", "user number");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        //user found
    console.log("Document data:", docSnap.data());
    } else {
        // user not found
    console.log("No such document!");
    }

})

newuser.post('/new-post', async(req,res) =>{

    const userRef = doc(db, "users", "user number");

    // update the posts doc for the user
    await updateDoc(userRef, {
        posts: []
    });

    
})

newuser.post('/get-posts', async(req,res) =>{

    const docRef = doc(db, "users", "user number");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        //Show all the posts made by the user
    console.log("Document data:", docSnap.data().posts);
    } else {
        // user not found
    console.log("No such document!");
    }
    
})

module.exports = {
    newuser : newuser,
}