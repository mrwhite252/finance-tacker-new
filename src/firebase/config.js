import firebase from "firebase";
import 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCHJ5JHaW9490_ZwgXw1ijx_WJOyYzSSy0",
    authDomain: "financetracker-da543.firebaseapp.com",
    projectId: "financetracker-da543",
    storageBucket: "financetracker-da543.appspot.com",
    messagingSenderId: "296968713509",
    appId: "1:296968713509:web:456f2095c37db020a656cc"
};


//   init firebase
firebase.initializeApp(firebaseConfig);

// init service
const projectFirestore = firebase.firestore();

export {
    projectFirestore
}