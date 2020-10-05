import React from "react";
import Box from "ui-box";

import "./OpenTile.css";

export const OpenTile = ({ face = null, ...props }) => {
  return (
    <Box
      className="OpenTile-container Tile-borderRadius"
      backgroundImage={face ? `url(${face})` : undefined}
      tabIndex="0"
      {...props}
    />
  );
};

export default OpenTile;
