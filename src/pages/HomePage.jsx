import React, { useState, useContext } from "react";
import Box from "ui-box";

import { onEnter } from "../utils";
import { EngineContext } from "../App";

const NewRoom = ({ onCreate, setMenu }) => {
  const [name, setName] = useState("");

  const handleStart = () => onCreate(name);

  return (
    <>
      <Box>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onEnter(handleStart)}
        />
      </Box>
      <Box>
        <button onClick={() => setMenu("home")}>Back</button>
        <button onClick={handleStart}>Start</button>
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
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      </Box>
      <Box>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onEnter(handleJoin)}
        />
      </Box>
      <Box>
        <button onClick={() => setMenu("home")}>Back</button>
        <button onClick={handleJoin}>Join</button>
      </Box>
    </>
  );
};

const Home = ({ setMenu }) => {
  return (
    <Box>
      <button onClick={() => setMenu("new")}>New Room</button>
      <button onClick={() => setMenu("join")}>Join Room</button>
    </Box>
  );
};

const HomePage = () => {
  const { GE } = useContext(EngineContext);
  const [menu, setMenu] = useState("home");

  return (
    <Box>
      <h1>Majiang</h1>
      {menu === "home" && <Home setMenu={setMenu} />}
      {menu === "new" && <NewRoom onCreate={GE.createRoom} setMenu={setMenu} />}
      {menu === "join" && <JoinRoom onJoin={GE.joinRoom} setMenu={setMenu} />}
    </Box>
  );
};

export default HomePage;
