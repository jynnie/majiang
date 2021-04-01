import React, { useContext } from "react";
import Box from "ui-box";
import cn from "classnames";
import Tile from "components/Tile";
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

  const hasWinner = !!winner?.name;

  return (
    <>
      <Box className="GameEnd-container">
        <Box className="GameEnd-stamp-border">
          <Box className={cn("GameEnd-stamp-fill", { draw: !hasWinner })}>
            {hasWinner ? "和" : "荒莊"}
          </Box>
        </Box>
        <Box className="GameEnd-textSpace">
          <Box is="h2">{winner?.name || "draw"}</Box>
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
            {!hasWinner && "ran out of tiles"}
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
