import React from "react";
import Box from "ui-box";

import "./PlayTile.css";

export const PlayTile = ({ width = 42, face = null, ...props }) => {
  const tileWidth = width;
  const tileHeight = (width * 4) / 3;
  const tileContainerHeight = tileHeight + tileHeight * 0.18;

  return (
    <Box
      className="PlayTile-container Tile-borderRadius"
      width={tileWidth}
      height={tileContainerHeight}
      tabIndex="0"
      {...props}
    >
      <Box className="PlayTile-back Tile-borderRadius PlayTile-side" />
      <Box className="PlayTile-top Tile-borderRadius PlayTile-side" />
      <Box
        className="PlayTile-front Tile-borderRadius PlayTile-side"
        backgroundImage={face ? `url(${face})` : undefined}
      />
    </Box>
  );
};

export default PlayTile;
