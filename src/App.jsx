import React, { useState, useEffect } from "react";

//- Component & Page Imports
import HomePage from "./pages/HomePage";
import LobbyPage from "./pages/LobbyPage";
import GamePage from "./pages/InGame/InGame";
import "./App.css";

//- Game Engine
import { GameEngine, Stages } from "./engine/GameEngine";

//- Firebase Imports
import firebase from "firebase";
import firebaseConfig from "./firebaseConfig";

//- Firebase Setup
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
export const FirebaseContext = React.createContext(null);

//- Game Engine Setup
const GE = new GameEngine();
export const EngineContext = React.createContext({ GE: GE });

//- App Setup
const App = (props) => {
  const [, setUpdate] = useState(null);

  useEffect(() => {
    GE.attachReact(setUpdate);
    GE.attachFirebase(db);
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
      stagePage = <HomePage />;
      break;
  }

  return (
    <EngineContext.Provider value={{ GE }}>
      <FirebaseContext.Provider value={{ db }}>
        {stagePage}
      </FirebaseContext.Provider>
    </EngineContext.Provider>
  );
};

export default App;
