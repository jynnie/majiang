import React from "react";
import Box from "ui-box";
import classnames from "classnames";
import Tippy from "@tippyjs/react";

import "./PlayTile.css";

const Tip = ({ data }) => {
  const isNum = data.params.suit !== "long" && data.params.suit !== "feng";

  return (
    <Box className="PlayTile-tip" marginBottom={12}>
      <Box className="PlayTile-tipValue">{data.value}</Box>
      {isNum && <Box className="PlayTile-tipSuit">{data.params.suit}</Box>}
    </Box>
  );
};

export const PlayTile = ({
  className,
  face = null,
  vertical = false,
  ...props
}) => {
  return (
    <Tippy placement="top" duration={0} content={<Tip {...props} />}>
      <Box
        className={classnames(
          className,
          "PlayTile-container Tile-borderRadius",
        )}
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
    </Tippy>
  );
};

export default PlayTile;
