import { EngineContext } from "App";
import { GameEngine } from "engine/GameEngine";
import {
  LEARN_GAME_PARAMS,
  LEARN_PLAYERS,
  LEARN_PLAYER_PARAMS,
} from "paks/mjng/DianXin/Learn.constants";
import React, { useContext, useEffect, useState } from "react";

import Table from "./InGame/components/Table";

// Majiang is a turn based, competitive, four player game
// How to win
// What are the basic tiles
// Let's jump into a game and teach you the basics
// On your turn, you first draw a tile
// Hmm, let's see what you got

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

// WORKAROUND: This is very specific to DianXin rules
async function setupLocalGame(GE: GameEngine) {
  GE.uid = "tuzi";
  GE.displayName = "Little Rabbit";
  GE.roomId = "LEARN";
  GE.hostPlayerId = "tuzi";

  const pak = GE.pak;

  // GE setupNewGame Method Rewritten for Local
  // Setup players
  GE.players = LEARN_PLAYERS;
  GE.playerParams = LEARN_PLAYER_PARAMS;

  // Setup cards
  GE.cards = pak.deck?.cards.map((card) => ({
    ...card,
    params: card.defaultParams,
  }));

  GE.gameParams = LEARN_GAME_PARAMS;

  GE.updateReact();
}
