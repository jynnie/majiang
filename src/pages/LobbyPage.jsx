import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../App";

const LobbyPage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <Box>
      <h2>Lobby</h2>
      <code>Code: {GE.roomId}</code>
      {GE.players.map((p) => (
        <Box key={p.id}>{p.name}</Box>
      ))}
      {GE.isHost && <button onClick={GE.startGame}>Start Game</button>}
    </Box>
  );
};

export default LobbyPage;
