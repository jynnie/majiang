import React from "react";
import Box from "ui-box";

import "./Seat.css";

export enum Orientation {
  T = "top",
  B = "bottom",
  R = "right",
  L = "left",
}

const SeatToWind: { [key: number]: string } = {
  0: "east",
  1: "south",
  2: "west",
  3: "north",
};

const WindChinese: { [key: string]: string } = {
  east: "東",
  south: "南",
  west: "西",
  north: "北",
};

export const Seat = ({
  orientation = Orientation.B,
  name = "anonymous",
  seat = 0,
  children,
  ...props
}: {
  orientation: Orientation;
  name: string;
  seat: number;
  children: any;
  props: any;
}) => {
  const wind = SeatToWind[seat];
  const windCN = WindChinese[wind];

  return (
    <Box className={"Seat-tray Seat-" + orientation} {...props}>
      <Box className="Seat-name">{name}</Box>
      <Box className="Seat-tileNumber">
        <span>0</span>
        <span className="Seat-tileNumber-slash">/</span>
        <span>14</span>
      </Box>
      <Box className="Seat-tiles">{children}</Box>
      <Box className="Seat-wind">
        <Box className="Seat-wind-line" />
        <span>
          <span className="Seat-wind-EN">{wind}</span>「{windCN}」
        </span>
      </Box>
    </Box>
  );
};

export default Seat;
