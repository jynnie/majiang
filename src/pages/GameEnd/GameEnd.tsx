import React, { useContext } from "react";
import Box from "ui-box";
import Tile from "components/Tile/Tile";
import { EngineContext } from "App";

import "./GameEnd.css";

const GamePage = () => {
  const { GE } = useContext(EngineContext);

  const winner = GE.pak?.getWinner?.(GE)?.[0];
  const closedHand = GE.pak
    ?.getVisualsOf(winner?.closedHand)
    .sort((a: any, b: any) => {
      if (a?.justDrawn) return 1;
      if (a?.params?.suit > b?.params.suit) return -1;
      if (a?.params?.suit < b?.params.suit) return 1;
      if (a?.value > b?.value) return 1;
      if (a?.value < b?.value) return -1;
      return 1;
    });

  return (
    <>
      <Box className="GameEnd-container">
        <Box className="GameEnd-stamp-border">
          <Box className="GameEnd-stamp-fill">護</Box>
        </Box>
        <Box className="GameEnd-textSpace">
          <Box is="h2">{winner?.name}</Box>
          <Box>
            {closedHand.map((tile: any, i) => (
              <Tile
                key={i}
                data={tile}
                closed={false}
                face={tile.visual}
                margin={1}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {GE.isHost && (
        <button
          className="HomePage-button HomePage-secondaryButton"
          onClick={GE.returnToLobby}
        >
          return to lobby
        </button>
      )}
    </>
  );
};

export default GamePage;
