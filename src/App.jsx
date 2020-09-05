import React, { useState, useEffect } from "react";

//- Component & Page Imports
import Auth from "./components/Auth";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/GamePage";
import "./App.css";

//- Game Engine
import GameEngine, { Stages } from "./engine/GameEngine";

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
// TODO: Switch to using EngineContext, also init Engine here
export const EngineContext = React.createContext({ engine: null });

//- App Setup
const App = (props) => {
  const { user, signOut, signInWithGoogle } = props;
  const [, setUpdate] = useState(null);

  useEffect(() => {
    GameEngine.attachReact(setUpdate);
  }, []);

  let stagePage;
  switch (GameEngine.stage) {
    case Stages.inLobby:
      stagePage = <LobbyPage />;
      break;
    case Stages.inGame:
      stagePage = <GamePage />;
      break;
    case Stages.gameEnd:
      break;
    case Stages.noRoom:
    default:
      stagePage = <button onClick={GameEngine.createRoom}>create room</button>;
      break;
  }

  return (
    <EngineContext.Provider value={{ engine: GameEngine }}>
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
