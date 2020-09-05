import React from "react";

import TileViewer from "./TileViewer";
import GameEngine from "../engine/GameEngine";

const GamePage = () => {
  return (
    <>
      In Game
      {GameEngine.playerParams.map((player) => (
        <TileViewer key={player.id} player={player} />
      ))}
    </>
  );
};

export default GamePage;
