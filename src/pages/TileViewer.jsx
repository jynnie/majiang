import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../App";

import Tile from "../components/Tile";

const TileViewer = ({ player }) => {
  const { GE } = useContext(EngineContext);

  const closedHand = GE.pak
    ?.getVisualsOf(player.closedHand)
    .sort((a, b) => a.value - b.value)
    .sort((a, b) => a.params.suit < b.params.suit);
  const openHand = player.openHand?.reduce(
    (acc, meld) => [...acc, ...GE.pak?.getVisualsOf(meld)],
    [],
  );
  const playedTiles = GE.pak?.getVisualsOf(player.playedTiles);
  const isMyTurn = GE.isPlayersTurn(player.id);

  const availableActions = GE.getAvailableActions(player.id);

  return (
    <Box borderTop="1px solid cadetblue" marginTop={24}>
      Player: {player.id} {isMyTurn && "👋🏼"}
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
      <Box>
        <Box>Closed hand</Box>
        {closedHand.map((tile, i) => (
          <Tile
            face={tile.visual}
            key={i}
            onClick={() =>
              GE.pak.rules.onCardClick({
                executingPlayerId: player.id,
                card: tile,
                GE: GE,
              })
            }
          />
        ))}
      </Box>
      <Box>
        <Box>Open hand</Box>
        {/* TODO: Make it so you can see your hidden tiles */}
        {openHand &&
          openHand.map((tile, i) => (
            <Tile face={!tile.hide && tile.visual} key={i} />
          ))}
      </Box>
      <Box>
        <Box>Played tiles</Box>
        {playedTiles.map((tile, i) => (
          <Tile face={tile.visual} key={i} />
        ))}
      </Box>
    </Box>
  );
};

export default TileViewer;
