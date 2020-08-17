import React from "react";

//- Component & Page Imports
import Auth from "./components/Auth";
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

export const FirebaseContext = React.createContext(null);

//- App Setup
const App = (props) => {
  const { user, signOut, signInWithGoogle } = props;

  return (
    <FirebaseContext.Provider value={{ user }}>
      <Auth signOut={signOut} signInWithGoogle={signInWithGoogle} />
    </FirebaseContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
