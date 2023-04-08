import { EngineContext } from "App";
import { GameEngine } from "engine/GameEngine";
import React, { useContext, useEffect, useState } from "react";

import Table from "./InGame/components/Table";

export function LearnPage() {
  const { GE } = useContext(EngineContext);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, localUpdate] = useState(0);

  const [step, setStep] = useState(0);

  useEffect(() => {
    GE.attachReact(localUpdate);
    setupLocalGame(GE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {step === 0 && (
        <>
          <h1>Learn Majiang</h1>
          <button
            className="HomePage-button HomePage-secondaryButton"
            onClick={() => setStep(1)}
          >
            start
          </button>
        </>
      )}
      {step !== 0 && (
        <div>
          <Table players={GE.activePlayerParams} />
        </div>
      )}
    </div>
  );
}

function setupLocalGame(GE: GameEngine) {
  GE.uid = "tuzi";
  GE.displayName = "Little Rabbit";
  GE.roomId = "LEARN";
  GE.hostPlayerId = "tuzi";

  // Setup players
  GE.players = [
    {
      id: "tuzi",
      connected: true,
    },
    { id: "houzi", connected: true },
    { id: "laohu", connected: true },
    { id: "niu", connected: true },
  ];
  GE.playerParams = [
    {
      id: "tuzi",
      name: "Little Rabbit",
      ...GE.pak.rules?.playerParams,
      points: 0,
      seat: 0,
    },
    {
      id: "houzi",
      name: "Monkey",
      ...GE.pak.rules?.playerParams,
      points: 0,
      seat: 1,
    },
    {
      id: "laohu",
      name: "Tiger",
      ...GE.pak.rules?.playerParams,
      points: 0,
      seat: 2,
    },
    {
      id: "niu",
      name: "Ox",
      ...GE.pak.rules?.playerParams,
      points: 0,
      seat: 3,
    },
  ];

  GE.updateReact();
}
