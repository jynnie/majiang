import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "../../../App";

import { Orientation } from "../../../components/Seat/Seat";
import Centerpiece from "../../../components/Centerpiece/Centerpiece";
import Player from "./Player";

import "./Table.css";

export const getOrientation = (seat, mySeat) => {
  const ori = {
    0: Orientation.B,
    1: Orientation.R,
    2: Orientation.T,
    3: Orientation.L,
  };
  let index = (seat - mySeat) % 4;
  index = index >= 0 ? index : index + 4;
  return ori[index];
};

const Table = ({ players }) => {
  const { GE } = useContext(EngineContext);

  if (!players) return null;

  const centerpieceData = players.map((player) => {
    const orientation = getOrientation(player.seat, GE.mySeat);
    const playedTiles = GE.pak?.getVisualsOf(player.playedTiles);
    const isTurn = GE.isPlayersTurn(player.id);
    return { orientation, playedTiles, isTurn };
  });

  return (
    <Box className="Table">
      <Centerpiece
        data={centerpieceData}
        tilesRemaining={GE.gameParams.wall.length}
        lastPlayed={GE.gameParams.lastPlay}
      />
      {players.map((player) => (
        <Player key={player.id} player={player} />
      ))}
    </Box>
  );
};

export default Table;
