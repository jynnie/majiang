import { EngineContext } from "App";
import { PlayTile } from "components/Tile";
import { GameEngine } from "engine/GameEngine";
import {
  LEARN_GAME_PARAMS,
  LEARN_PLAYERS,
  LEARN_PLAYER_PARAMS,
  getTileData,
} from "paks/mjng/DianXin/Learn.constants";
import React, { useContext, useEffect, useState } from "react";
import Box from "ui-box";

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

  // FIXME: Set Step on localStorage
  const [step, setStep] = useState(0);

  useEffect(() => {
    GE.attachReact(localUpdate);
    setupLocalGame(GE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {step === 0 && (
        <Box maxWidth={300}>
          <h1>Let's Learn Majiang!</h1>
          <p>
            Learn to play Majiang. This simplified Cantonese ruleset is the
            basis of many variations.
          </p>
          <button
            className="HomePage-button HomePage-primaryButton"
            onClick={() => setStep(1)}
          >
            Let's Go!
          </button>
        </Box>
      )}
      {step === 1 && (
        <Box maxWidth={300}>
          <h2>Majiang is a turn-based, competitive, four player game.</h2>
          <p>
            Over several turns, you try to make a winning hand before everyone
            else.
          </p>
        </Box>
      )}
      {step === 2 && (
        <Box maxWidth={300}>
          <p>
            A winning hand is made up of 14 tiles, within which there are{" "}
            <span className="text-poppy bold">four melds</span> and{" "}
            <span className="text-jade bold">one pair</span>.
          </p>
          <p>Let's take a look at the winning hand</p>
        </Box>
      )}
      {step === 3 && (
        <Box display="flex" gap={16}>
          <Box maxWidth={120}>
            <Box>
              {getTileData(["dongfeng", "dongfeng", "dongfeng"]).map((t, i) => (
                <PlayTile key={i} face={t.visual} data={t} />
              ))}
            </Box>
            <p className="text-poppy">Three of a Kind Meld</p>
          </Box>
          <Box maxWidth={120}>
            <Box>
              {getTileData(["yaoji", "liangtiao", "santiao"]).map((t, i) => (
                <PlayTile key={i} face={t.visual} data={t} />
              ))}
            </Box>
            <p className="text-poppy">
              Meld of Consecutive Numbers of One Suit
            </p>
          </Box>
          <Box maxWidth={120}>
            <Box>
              {getTileData(["sanwan", "siwan", "wuwan"]).map((t, i) => (
                <PlayTile key={i} face={t.visual} data={t} />
              ))}
            </Box>
            <p className="text-poppy">
              Meld of Consecutive Numbers of One Suit
            </p>
          </Box>
          <Box maxWidth={120}>
            <Box>
              {getTileData(["batong", "batong", "batong"]).map((t, i) => (
                <PlayTile key={i} face={t.visual} data={t} />
              ))}
            </Box>
            <p className="text-poppy">Three of a Kind Meld</p>
          </Box>
          <Box>
            <Box>
              {getTileData(["liuwan", "liuwan"]).map((t, i) => (
                <PlayTile key={i} face={t.visual} data={t} />
              ))}
            </Box>
            <p className="text-jade">Pair of Matching Tiles</p>
          </Box>
        </Box>
      )}
      {step >= 1 && step <= 10 && (
        <Box display="flex" justifyContent="flex-end">
          <button
            className="HomePage-button HomePage-secondaryButton"
            onClick={() => setStep((s) => s - 1)}
          >
            ← Back
          </button>
          <button
            className="HomePage-button HomePage-primaryButton"
            onClick={() => setStep((s) => s + 1)}
          >
            Continue →
          </button>
        </Box>
      )}

      {step >= 10 && (
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
