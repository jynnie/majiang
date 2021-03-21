import React, { useState, useContext } from "react";
import { navigate } from "@reach/router";
import Box from "ui-box";

import { FlexColCenter } from "../components/Flex";
import { onEnter } from "../utils";
import { EngineContext } from "../App";

const JoinRoom = ({ onJoin, roomId }) => {
  const [name, setName] = useState("");

  const handleJoin = () => onJoin(roomId, name);
  const goBack = () => navigate("/");

  return (
    <>
      <Box>
        <label>Name</label>
        <input
          className="HomePage-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onEnter(handleJoin)}
        />
      </Box>
      <Box>
        <button
          className="HomePage-button HomePage-secondaryButton"
          onClick={goBack}
        >
          Back
        </button>
        <button
          className="HomePage-button HomePage-primaryButton"
          onClick={handleJoin}
        >
          Join
        </button>
      </Box>
    </>
  );
};

const JoinPage = ({ roomId }) => {
  const { GE } = useContext(EngineContext);

  return (
    <Box {...FlexColCenter}>
      <Box {...FlexColCenter} position="relative">
        <Box is="h1" fontSize={72} opacity={0.2} margin={0}>
          「麻将」
        </Box>
        <Box is="h1" position="absolute">
          MAJIANG
        </Box>
      </Box>
      <Box is="code" marginBottom={16}>
        Code: {roomId}
      </Box>
      <JoinRoom onJoin={GE.joinRoom} roomId={roomId} />
    </Box>
  );
};

export default JoinPage;
