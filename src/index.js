// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getFirestore, collection, onSnapshot, 
    addDoc, deleteDoc, doc,
    query, where, orderBy,
    serverTimestamp,
    getDoc, updateDoc
} from "firebase/firestore";
import { 
    getAuth, createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword 
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDt6Ke414maENjgvWo8OvOmd3sRoE87Slw",
    authDomain: "my-app-4c0ef.firebaseapp.com",
    projectId: "my-app-4c0ef",
    storageBucket: "my-app-4c0ef.appspot.com",
    messagingSenderId: "251718027798",
    appId: "1:251718027798:web:318a92b86f0770bc978337",
    measurementId: "G-K7ZHKSS612"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
const db = getFirestore();
const auth = getAuth();

// Collection ref
const colRef = collection(db, 'books');

// queries
const q = query(colRef, orderBy('createdAt'));

// real time collection data
onSnapshot(q, (snapshot) => {
    let books = [];
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id})
    })
    console.log(books);
})

// adding documents
const addBookForm = document.querySelector('.add');
addBookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
        .then(() => {
            addBookForm.reset();
        })

})

// deleting documents
const deleteBookForm = document.querySelector('.delete');
deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', deleteBookForm.id.value);

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
})

// Get a single document
const docRef = doc(db, 'books', 'mKADcjCpIbBsZOmTxiUq');

onSnapshot(docRef, () => {
    console.log(doc.data, doc.id)
})

// updating a document
const updateForm = document.querySelector('.update');
updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const docRef = doc(db, 'books', updateForm.id.value);
    updateDoc(docRef, {
        title: 'Updated title',
    })
        .then(() => {
            updateForm.reset()
        })

})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value;
    const password = signupForm.password.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User created:', cred.user)
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('User logged out')
        })
        .catch(err => {
            console.log(err.message)
        })
})

const loginForm = document.querySelector('.login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('User logged in:', cred.user)
            loginForm.reset()
        })
        .catch(error => {
            console.log(error.message);
        })
})