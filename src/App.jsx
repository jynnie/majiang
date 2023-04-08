import "./App.css";

import firebase from "firebase";
import React, { useEffect } from "react";

import { Router } from "@reach/router";

import { GameEngine } from "./engine/GameEngine";
import { firebaseConfig } from "./firebaseConfig";
import GamePage from "./pages";
import HomePage from "./pages/HomePage";

//- Firebase Setup
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
export const FirebaseContext = React.createContext(null);
// FIXME: We actually don't need to create a Firebase Ctx, we could instead create
// a firebase.ts file that directly exports the db object. This would be cleaner.

//- Game Engine Setup
const GE = new GameEngine();
export const EngineContext = React.createContext({ GE: GE });
// FIXME: We actually don't need to create a GE Ctx, we could instead directly export
// the GE object. This would be cleaner.

//- App Setup
const App = (props) => {
  useEffect(() => {
    GE.attachFirebase(db);
  }, []);

  return (
    <EngineContext.Provider value={{ GE }}>
      <FirebaseContext.Provider value={{ db }}>
        <Router>
          <HomePage path="/" default />
          <GamePage path="/:roomId" />
        </Router>
      </FirebaseContext.Provider>
    </EngineContext.Provider>
  );
};

export default App;
