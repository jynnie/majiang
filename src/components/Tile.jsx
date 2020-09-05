import React from "react";
import Box from "ui-box";

import "./Tile.css";

export const Tile = ({ width = 42, face = null, ...props }) => {
  return (
    <Box
      className="Tile-container two"
      width={width}
      height={(width * 4) / 3}
      tabIndex="0"
      {...props}
    >
      <Box
        className="Tile-front Tile-side"
        backgroundImage={face ? `url(${face})` : undefined}
      />
      <Box className="Tile-back Tile-side" />
      <Box className="Tile-top Tile-side" />
      <Box className="Tile-bottom Tile-side" />
      <Box className="Tile-left Tile-side" />
      <Box className="Tile-right Tile-side" />
    </Box>
  );
};

export default Tile;
