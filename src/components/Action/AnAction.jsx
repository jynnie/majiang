import React from "react";
import Box from "ui-box";
import classnames from "classnames";

import "./AnAction.css";

const AnAction = ({ className, CN, EN, details, ...props }) => {
  return (
    <Box
      className={classnames(className, "AnAction")}
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

const DrawAction = (props) => (
  <AnAction className="Draw" EN="draw" CN="抽" {...props} />
);

const ChiAction = (props) => (
  <AnAction className="Chi" EN="chī" CN="吃" {...props} />
);

const PengAction = (props) => (
  <AnAction className="Peng" EN="pÈng" CN="碰" {...props} />
);

const GangAction = (props) => (
  <AnAction className="Gang" EN="gÀng" CN="剛" {...props} />
);

const HuAction = (props) => (
  <AnAction className="Hu" EN="hÚ" CN="護" {...props} />
);

const SkipAction = (props) => (
  <AnAction className="Skip" EN="Skip" CN="不" {...props} />
);

export { DrawAction, ChiAction, PengAction, GangAction, HuAction, SkipAction };
