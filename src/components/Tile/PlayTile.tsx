import "./PlayTile.css";

import classnames from "classnames";
import React from "react";
import Box, { BoxProps } from "ui-box";

import Tippy from "@tippyjs/react";

const Tip = ({ data }: { data: any }) => {
  const isNum = data.params.suit !== "long" && data.params.suit !== "feng";

  return (
    <Box className="PlayTile-tip" marginBottom={12}>
      <Box className="PlayTile-tipValue">{data.value}</Box>
      {isNum && <Box className="PlayTile-tipSuit">{data.params.suit}</Box>}
    </Box>
  );
};

interface PlayTileProps extends BoxProps<"div"> {
  face: string | null;
  vertical?: boolean;
  data: any;
}

export const PlayTile = ({
  className,
  face = null,
  vertical = false,
  ...props
}: PlayTileProps) => {
  return (
    <Tippy placement="top" duration={0} content={<Tip {...props} />}>
      <Box
        className={classnames(
          className,
          "PlayTile-container Tile-borderRadius",
        )}
        tabIndex={0}
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
