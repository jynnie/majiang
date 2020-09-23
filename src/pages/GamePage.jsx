import React, { useContext } from "react";

import { EngineContext } from "../App";

import TileViewer from "./TileViewer";

const GamePage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <>
      In Game
      {GE.playerParams?.map((player) => (
        <TileViewer key={player.id} player={player} />
      ))}
    </>
  );
};

export default GamePage;
