import React from "react";
import Box from "ui-box";

import "./ClosedTile.css";

export const ClosedTile = ({ width = 42, vertical = false, ...props }) => {
  const tileWidth = !vertical ? width : width * 0.35;
  const tileHeight = !vertical ? width * 0.35 : width;

  return (
    <Box
      className="ClosedTile-container Tile-borderRadius"
      width={tileWidth}
      height={tileHeight}
      tabIndex="0"
      {...props}
    />
  );
};

export default ClosedTile;
