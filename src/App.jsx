import React from "react";

//- Component & Page Imports
import Auth from "./components/Auth";
import Tile from "./components/Tile";
import "./App.css";

//- Firebase Imports
import withFirebaseAuth from "react-with-firebase-auth";
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";
import "firebase/auth";

//- Firebase Setup
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};
const db = firebase.firestore();

export const FirebaseContext = React.createContext(null);

//- App Setup
const App = (props) => {
  const { user, signOut, signInWithGoogle } = props;

  return (
    <FirebaseContext.Provider value={{ user, db }}>
      <Auth signOut={signOut} signInWithGoogle={signInWithGoogle} />
      <Tile face="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fherschelian.files.wordpress.com%2F2011%2F04%2Fmahjong-tiles-dragons.jpg&f=1&nofb=1" />
    </FirebaseContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
