import React, { useState, useContext } from "react";
import Box from "ui-box";

import { FlexColCenter } from "../components/Flex";
import { onEnter } from "../utils";
import { EngineContext } from "../App";

import "./HomePage.css";

const NewRoom = ({ onCreate, setMenu }) => {
  const [name, setName] = useState("");

  const handleStart = () => onCreate(name);

  return (
    <>
      <Box>
        <label>Name</label>
        <input
          className="HomePage-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onEnter(handleStart)}
        />
      </Box>
      <Box>
        <button
          className="HomePage-button HomePage-secondaryButton"
          onClick={() => setMenu("home")}
        >
          Back
        </button>
        <button
          className="HomePage-button HomePage-primaryButton"
          onClick={handleStart}
        >
          Start
        </button>
      </Box>
    </>
  );
};

const JoinRoom = ({ onJoin, setMenu }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => onJoin(roomId, name);

  return (
    <>
      <Box>
        <label>Game Code</label>
        <input
          className="HomePage-input"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </Box>
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
          onClick={() => setMenu("home")}
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

const Home = ({ setMenu }) => {
  return (
    <Box>
      <button
        className="HomePage-button HomePage-primaryButton"
        onClick={() => setMenu("new")}
      >
        New Room
      </button>
      <button
        className="HomePage-button HomePage-secondaryButton"
        onClick={() => setMenu("join")}
      >
        Join Room
      </button>
    </Box>
  );
};

const HomePage = () => {
  const { GE } = useContext(EngineContext);
  const [menu, setMenu] = useState("home");

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
      {menu === "home" && <Home setMenu={setMenu} />}
      {menu === "new" && <NewRoom onCreate={GE.createRoom} setMenu={setMenu} />}
      {menu === "join" && <JoinRoom onJoin={GE.joinRoom} setMenu={setMenu} />}
    </Box>
  );
};

export default HomePage;
