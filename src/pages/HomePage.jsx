import React, { useState, useContext } from "react";

import { EngineContext } from "../App";

const LobbyPage = () => {
  const { GE } = useContext(EngineContext);
  const [roomId, setRoomId] = useState("");

  return (
    <>
      Home
      <div>
        <button onClick={GE.createRoom}>New Room</button>
      </div>
      <div>
        <input value={roomId} onChange={(e) => setRoomId(e.target.value)} />
        <button onClick={() => GE.joinRoom(roomId)}>Join Room</button>
      </div>
    </>
  );
};

export default LobbyPage;
