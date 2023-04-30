import "./HomePage.css";

import React, { useContext, useState } from "react";
import Box from "ui-box";

import { navigate } from "@reach/router";

import { EngineContext } from "../App";
import { FlexColCenter } from "../components/Flex";
import { onEnter } from "../utils";

function HomePage() {
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
}

function NewRoom({
  onCreate,
  setMenu,
}: {
  onCreate: (
    name: string,
    roomId?: string | undefined,
  ) => Promise<string | undefined>;
  setMenu: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const handleStart = async () => {
    const roomId = await onCreate(name);
    navigate(`/${roomId}`);
  };

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
}

function JoinRoom({
  onJoin,
  setMenu,
}: {
  onJoin: (roomId: string, name?: string) => Promise<string | undefined>;
  setMenu: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleJoin = async () => {
    const finalRoomId = await onJoin(roomId, name);
    navigate(`/${finalRoomId}`);
  };

  return (
    <>
      <Box marginBottom={8}>
        <label>Game Code</label>
        <input
          className="HomePage-input"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </Box>
      <div>
        <label>Name</label>
        <input
          className="HomePage-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={onEnter(handleJoin)}
        />
      </div>
      <div>
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
      </div>
    </>
  );
}

function Home({ setMenu }: { setMenu: (name: string) => void }) {
  return (
    <Box>
      <Box is="p" textAlign="center">
        Play Majiang with friends.
        <br />
        Create a room and share the code.
      </Box>

      <Box display="flex" justifyContent="center">
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

      <Box is="p" textAlign="center" fontSize="0.8em">
        Basics of Majiang{" "}
        <a
          href="https://www.dropbox.com/s/8cwoefc0b0cer0l/Majiang%20Cheatsheet.pdf?dl=0"
          target="_blank"
          rel="noopener noreferrer"
        >
          Cheatsheet
        </a>
      </Box>
    </Box>
  );
}

export default HomePage;
