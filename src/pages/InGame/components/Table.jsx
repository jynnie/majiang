import React from "react";
import Box from "ui-box";

import Player from "./Player";

import "./Table.css";

const GamePage = ({ players }) => {
  if (!players) return null;

  return (
    <Box className="Table">
      {players.map((player) => (
        <Player key={player.id} player={player} />
      ))}
    </Box>
  );
};

export default GamePage;
