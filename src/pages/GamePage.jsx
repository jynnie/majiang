import React, { useContext, useEffect, useState } from "react";
import { navigate } from "@reach/router";
import { Stages } from "engine/GameEngine";

//- Component & Page Imports
import JoinPage from "./JoinPage";
import LobbyPage from "./LobbyPage";
import GamePage from "./InGame/InGame";
import GameEndPage from "./GameEnd/GameEnd";
import { EngineContext } from "../App";

const BaseGamePage = (props) => {
  const { GE } = useContext(EngineContext);
  const [, setUpdate] = useState(null);
  const [roomExists, setRoomExists] = useState(null);

  // From Reach Router
  const roomId = props.roomId;

  useEffect(() => {
    const tryRoom = async () => {
      const success = await GE.tryRoom(roomId);
      if (success === false) navigate("/");
      else setRoomExists(success !== false);
    };

    if (!roomId) navigate("/");
    else tryRoom();
  }, [roomId, GE]);

  useEffect(() => {
    GE.attachReact(setUpdate);
  }, [GE]);

  let stagePage;
  switch (GE.stage) {
    case Stages.inLobby:
      stagePage = <LobbyPage />;
      break;
    case Stages.inGame:
      stagePage = <GamePage />;
      break;
    case Stages.gameEnd:
      stagePage = <GameEndPage />;
      break;
    case Stages.noRoom:
    default:
      stagePage = "Loading...";
      break;
  }

  // If we now confirmed the room exists, but you haven't actually
  // entered it, we need to show join
  if (roomId && roomExists && stagePage === "Loading...") {
    stagePage = <JoinPage roomId={roomId} />;
  }

  return <>{stagePage}</>;
};

export default BaseGamePage;
