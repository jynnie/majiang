import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../../../App";

import Seat from "../../../components/Seat/Seat";

import { getOrientation } from "./Table";

const Player = ({ player }) => {
  const { GE } = useContext(EngineContext);

  const closedHand = GE.pak?.getVisualsOf(player.closedHand).sort((a, b) => {
    if (a.params.suit > b.params.suit) return -1;
    if (a.params.suit < b.params.suit) return 1;
    if (a.value > b.value) return 1;
    if (a.value < b.value) return -1;
  });
  const openHand = GE.pak
    ?.getOpenHand(player)
    .reduce((acc, meld) => [...acc, GE.pak?.getVisualsOf(meld)], []);

  const isSelf = GE.userId === player.id;

  const orientation = getOrientation(player.seat, GE.mySeat);

  const availableActions = GE.getAvailableActions(player.id);

  const handleTileClick = (tile) => {
    GE.pak.rules.onCardClick({
      executingPlayerId: player.id,
      card: tile,
      gameEngine: GE,
    });
  };

  return (
    <Box className={"Player Player-" + orientation}>
      <Seat
        isSelf={isSelf}
        name={player.name}
        seat={player.seat}
        orientation={orientation}
        closedHand={closedHand}
        openHand={openHand}
        onTileClick={handleTileClick}
        availableActions={availableActions}
        executingParams={{
          executingPlayerId: player.id,
          gameEngine: GE,
        }}
      />
    </Box>
  );
};

export default Player;
