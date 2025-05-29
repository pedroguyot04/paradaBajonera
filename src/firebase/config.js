import app from 'firebase/app'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyChw6yJJO6sAvgzVrg-dg_hPcegQBo-hoo",
  authDomain: "parada-bajonera.firebaseapp.com",
  projectId: "parada-bajonera",
  storageBucket: "parada-bajonera.firebasestorage.app",
  messagingSenderId: "274524331520",
  appId: "1:274524331520:web:0f9c9fe5fc0d2060f0c2e5"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();
