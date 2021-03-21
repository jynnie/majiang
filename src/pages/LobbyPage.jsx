import React, { useContext } from "react";
import Box from "ui-box";

import { FlexColCenter } from "../components/Flex";
import { EngineContext } from "../App";

import "./LobbyPage.css";

const LobbyPage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <Box {...FlexColCenter}>
      <Box is="h2" margin={0}>
        LOBBY
      </Box>
      <Box is="code" marginBottom={16}>
        Code: {GE.roomId}
      </Box>

      {GE.players.map((p) => (
        <Box className="LobbyPage-player" key={p.id}>
          {p.name}
        </Box>
      ))}
      {GE.isHost && (
        <button
          className="HomePage-button HomePage-secondaryButton"
          onClick={GE.startGame}
        >
          Start Game
        </button>
      )}
    </Box>
  );
};

export default LobbyPage;
