import React from "react";
import Box from "ui-box";

import "./PlayTile.css";

export const PlayTile = ({ face = null, ...props }) => {
  return (
    <Box
      className="PlayTile-container Tile-borderRadius"
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
