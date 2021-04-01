import React from "react";
import Box from "ui-box";
import { WindChinese } from "components/ZhongWenHelpers";

import Tile from "../Tile";
import Action from "../Action";

import "./Seat.css";

export enum Orientation {
  T = "top",
  B = "bottom",
  R = "right",
  L = "left",
}

interface SeatProps {
  isSelf: boolean;
  orientation: Orientation;
  name: string;
  seat: number;
  tiles: any[];
  closedHand: any[];
  openHand: any[][];
  onTileClick: (tile: any) => {};
  availableActions: any[];
  executingParams: any;
  props: any;
}

const SeatToWind: { [key: number]: string } = {
  0: "east",
  1: "south",
  2: "west",
  3: "north",
};

export const Seat = ({
  isSelf = false,
  orientation = Orientation.B,
  name = "anonymous",
  seat = 0,
  tiles = [],
  closedHand = [],
  openHand = [],
  onTileClick,
  availableActions = [],
  executingParams,
  ...props
}: SeatProps) => {
  const wind = SeatToWind[seat];
  const windCN = WindChinese[wind];

  return (
    <Box className={"Seat-tray Seat-" + orientation} {...props}>
      <Box className="Seat-name">{name}</Box>
      <Box className="Seat-tileNumber">
        <span>{closedHand.length}</span>
        <span className="Seat-tileNumber-slash">/</span>
        <span>14</span>
      </Box>
      <Box className="Seat-wind">
        <Box className="Seat-wind-line" />
        <span>
          <span className="Seat-wind-EN">{wind}</span>「{windCN}」
        </span>
      </Box>

      <Box className="Seat-tiles">
        {closedHand.map((tile, i) => (
          <Tile
            className={isSelf && tile.justDrawn && "PlayTile-justDrawn"}
            key={i}
            data={tile}
            closed={!isSelf}
            face={tile.visual}
            onClick={isSelf ? () => onTileClick(tile) : null}
            vertical={[Orientation.L, Orientation.R].includes(orientation)}
            margin={!isSelf ? 1 : 0}
          />
        ))}
      </Box>

      <Box className="Seat-openTiles">
        {openHand.map((meld) => (
          <Box className="Seat-meld">
            {meld.map((tile) => (
              <Tile.Open key={tile.id} face={tile.visual} />
            ))}
          </Box>
        ))}
      </Box>

      <Box className="Seat-actions">
        {isSelf &&
          executingParams &&
          availableActions.map((action) => (
            <Action
              key={action.name}
              name={action.name}
              onClick={() => action.onExecute(executingParams)}
            />
          ))}
      </Box>
    </Box>
  );
};

export default Seat;
