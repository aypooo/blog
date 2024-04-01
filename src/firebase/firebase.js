import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbS17-hEd176XyAkhxq8oP1sakUVi79ts",
  authDomain: "blog-5b35e.firebaseapp.com",
  databaseURL: "https://blog-5b35e-default-rtdb.firebaseio.com",
  projectId: "blog-5b35e",
  storageBucket: "blog-5b35e.appspot.com",
  messagingSenderId: "978221748264",
  appId: "1:978221748264:web:906a686846759f12eae51d",
  measurementId: "G-WLNNP12D9P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app)

export {app,auth,db,storage}