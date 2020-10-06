import React from "react";
import Box from "ui-box";
import classnames from "classnames";

import "./OpenTile.css";

export const OpenTile = ({ className = null, face = null, ...props }) => {
  return (
    <Box
      className={classnames(
        className,
        "OpenTile-container",
        "Tile-borderRadius",
      )}
      backgroundImage={face ? `url(${face})` : undefined}
      tabIndex="0"
      {...props}
    />
  );
};

export default OpenTile;
