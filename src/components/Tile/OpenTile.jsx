import React from "react";
import Box from "ui-box";

import "./OpenTile.css";

export const OpenTile = ({ width = 32, face = null, ...props }) => {
  const tileWidth = width;
  const tileHeight = (width * 4) / 3;

  return (
    <Box
      className="OpenTile-container Tile-borderRadius"
      width={tileWidth}
      height={tileHeight}
      backgroundImage={face ? `url(${face})` : undefined}
      tabIndex="0"
      {...props}
    />
  );
};

export default OpenTile;
