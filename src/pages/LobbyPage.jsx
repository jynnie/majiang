import React from "react";

import GameEngine from "../engine/GameEngine";

const LobbyPage = () => {
  return (
    <>
      Lobby
      <button onClick={GameEngine.startGame}>Start Game</button>
    </>
  );
};

export default LobbyPage;
