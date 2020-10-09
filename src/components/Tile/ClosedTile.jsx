import React from "react";
import Box from "ui-box";
import classnames from "classnames";

import "./ClosedTile.css";

export const ClosedTile = ({
  className,
  width = 42,
  vertical = false,
  ...props
}) => {
  const tileWidth = !vertical ? width : width * 0.35;
  const tileHeight = !vertical ? width * 0.35 : width;

  return (
    <Box
      className={classnames(
        className,
        "ClosedTile-container",
        "Tile-borderRadius",
        {
          "ClosedTile-vertical": vertical,
        },
      )}
      width={tileWidth}
      height={tileHeight}
      {...props}
    />
  );
};

export default ClosedTile;
