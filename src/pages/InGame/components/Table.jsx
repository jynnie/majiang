import React, { useContext } from "react";
import Box from "ui-box";

import { EngineContext } from "App";
import { Orientation } from "components/Seat";
import Centerpiece from "components/Centerpiece";

import Player from "./Player";

import "./Table.css";
import { WindChinese } from "components/ZhongWenHelpers";
import { oKey } from "utils";

export const getOrientation = (seat, mySeat) => {
  const baseSeat = mySeat || 0;
  const ori = {
    0: Orientation.B,
    1: Orientation.R,
    2: Orientation.T,
    3: Orientation.L,
  };
  let index = (seat - baseSeat) % 4;
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

  const wind = oKey(WindChinese)[GE.gameParams?.wind || 0];

  return (
    <Box className="Table">
      <Centerpiece
        data={centerpieceData}
        wind={wind}
        tilesRemaining={GE.gameParams?.wall?.length}
        lastPlayed={GE.gameParams?.lastPlay}
      />
      {players.map((player) => (
        <Player key={player.id} player={player} />
      ))}
    </Box>
  );
};

export default Table;
