import React, { useState, useEffect } from "react";

//- Component & Page Imports
import Auth from "./components/Auth";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import "./App.css";

//- Game Engine
import { GameEngine, Stages } from "./engine/GameEngine";

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

//- Game Engine Setup
const GE = new GameEngine();
export const EngineContext = React.createContext({ GE: GE });

//- App Setup
const App = (props) => {
  const { user, signOut, signInWithGoogle } = props;
  const [, setUpdate] = useState(null);

  useEffect(() => {
    GE.attachReact(setUpdate);
  }, []);

  let stagePage;
  switch (GE.stage) {
    case Stages.inLobby:
      stagePage = <LobbyPage />;
      break;
    case Stages.inGame:
      stagePage = <GamePage />;
      break;
    case Stages.gameEnd:
      stagePage = "Game end";
      break;
    case Stages.noRoom:
    default:
      stagePage = <button onClick={GE.createRoom}>create room</button>;
      break;
  }

  return (
    <EngineContext.Provider value={{ GE }}>
      <FirebaseContext.Provider value={{ user, db }}>
        <Auth signOut={signOut} signInWithGoogle={signInWithGoogle} />
        {stagePage}
      </FirebaseContext.Provider>
    </EngineContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(App);
