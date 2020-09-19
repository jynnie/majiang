import React, { useContext } from "react";

import { EngineContext } from "../App";

const LobbyPage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <>
      Lobby
      <button onClick={GE.startGame}>Start Game</button>
    </>
  );
};

export default LobbyPage;
