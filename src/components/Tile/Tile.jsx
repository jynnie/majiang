import React from "react";

import "./Tile.css";
import PlayTile from "./PlayTile";
import OpenTile from "./OpenTile";
import ClosedTile from "./ClosedTile";

const Tile = ({ open = false, closed = false, ...props }) => {
  if (open) return <OpenTile {...props} />;
  if (closed) return <ClosedTile {...props} />;
  return <PlayTile {...props} />;
};

Tile.Open = OpenTile;
Tile.Closed = ClosedTile;

export default Tile;
