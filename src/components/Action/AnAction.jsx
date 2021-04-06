import React from "react";
import Box from "ui-box";
import cn from "classnames";
import useSound from "use-sound";

import "./AnAction.css";

const DRAW_SFX = require("sounds/pick-up.mp3");

const AnAction = ({ className, CN, EN, details, ...props }) => {
  return (
    <Box
      className={cn(className, "AnAction")}
      role="button"
      tabIndex="0"
      {...props}
    >
      <Box className="AnAction-CN">{CN}</Box>
      <Box className="AnAction-EN">{EN}</Box>
      <Box className="AnAction-details">{details}</Box>
    </Box>
  );
};

const DrawAction = ({ onClick, ...props }) => {
  const [play] = useSound(DRAW_SFX);

  const handleClick = (evt) => {
    if (onClick) onClick(evt);
    play();
  };

  return (
    <AnAction
      className="Draw"
      EN="draw"
      CN="抽"
      onClick={handleClick}
      {...props}
    />
  );
};

const ChiAction = (props) => (
  <AnAction className="Chi" EN="chī" CN="吃" {...props} />
);

const PengAction = (props) => (
  <AnAction className="Peng" EN="pÈng" CN="碰" {...props} />
);

const GangAction = (props) => (
  <AnAction className="Gang" EN="gÀng" CN="槓" {...props} />
);

const AnGangAction = (props) => (
  <AnAction className="Gang" EN="Àn gÀng" CN="暗槓" {...props} />
);

const HuAction = (props) => (
  <AnAction className="Hu" EN="hÚ" CN="和" {...props} />
);

const SkipAction = (props) => (
  <AnAction className="Skip" EN="Skip" CN="不" {...props} />
);

export {
  DrawAction,
  ChiAction,
  PengAction,
  AnGangAction,
  GangAction,
  HuAction,
  SkipAction,
};
