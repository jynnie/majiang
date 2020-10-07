import React, { useState, useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../App";

const NewRoom = ({ onCreate, setMenu }) => {
  const [name, setName] = useState("");

  return (
    <>
      <Box>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Box>
      <Box>
        <button onClick={() => setMenu("home")}>Back</button>
        <button onClick={() => onCreate(name)}>Start</button>
      </Box>
    </>
  );
};

const JoinRoom = ({ onJoin, setMenu }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  return (
    <>
      <Box>
        <label>Game Code</label>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
      </Box>
      <Box>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </Box>
      <Box>
        <button onClick={() => setMenu("home")}>Back</button>
        <button onClick={() => onJoin(roomId, name)}>Join</button>
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
