import React from "react";
import Box from "ui-box";

import Tile from "../components/Tile";
import GameEngine from "../engine/GameEngine";

const TileViewer = ({ player }) => {
  const closedHand = GameEngine.pak
    ?.getVisualsOf(player.closedHand)
    .sort((a, b) => a.value - b.value)
    .sort((a, b) => a.params.suit < b.params.suit);
  const openHand = player.openHand?.reduce(
    (acc, meld) => [...acc, ...GameEngine.pak?.getVisualsOf(meld)],
    [],
  );
  const playedTiles = GameEngine.pak?.getVisualsOf(player.playedTiles);
  const isMyTurn = GameEngine.isPlayersTurn(player.id);

  const availableActions = GameEngine.getAvailableActions(player.id);

  return (
    <Box borderTop="1px solid cadetblue" marginTop={24}>
      Player: {player.seat} {isMyTurn && "👋🏼"}
      <Box>
        {availableActions.map((action) => (
          <button
            key={action.name}
            onClick={() =>
              action.onExecute({
                executingPlayerId: player.id,
                gameEngine: GameEngine,
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
              GameEngine.pak.rules.onCardClick({
                executingPlayerId: player.id,
                card: tile,
                gameEngine: GameEngine,
              })
            }
          />
        ))}
      </Box>
      <Box>
        <Box>Open hand</Box>
        {openHand &&
          openHand.map((tile, i) => <Tile face={tile.visual} key={i} />)}
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
