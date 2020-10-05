import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../../../App";

import Seat, { Orientation } from "../../../components/Seat/Seat";
import { getOrientation } from "./Table";

const Player = ({ player }) => {
  const { GE } = useContext(EngineContext);

  const closedHand = GE.pak
    ?.getVisualsOf(player.closedHand)
    .sort((a, b) => a.value - b.value)
    .sort((a, b) => a.params.suit < b.params.suit);
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
      {/* Player: {player.id} {player.seat} {isMyTurn && "👋🏼"} */}
      <Box>
        {availableActions.map((action) => (
          <button
            key={action.name}
            onClick={() =>
              action.onExecute({
                executingPlayerId: player.id,
                gameEngine: GE,
              })
            }
          >
            {action.name}
          </button>
        ))}
      </Box>
      <Seat
        isSelf={isSelf}
        name={player.name}
        seat={player.seat}
        orientation={orientation}
        closedHand={closedHand}
        openHand={openHand}
        onTileClick={handleTileClick}
      />
    </Box>
  );
};

export default Player;
