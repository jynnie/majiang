import React from "react";

import {
  DrawAction,
  ChiAction,
  PengAction,
  GangAction,
  HuAction,
  SkipAction,
} from "./AnAction";

// import "./Action.css";

const Action = ({ name, onClick }) => {
  if (name === "Draw") return <DrawAction onClick={onClick} />;
  if (name === "Chi") return <ChiAction onClick={onClick} />;
  if (name === "Peng") return <PengAction onClick={onClick} />;
  if (name === "Gang") return <GangAction onClick={onClick} />;
  if (name === "Hu") return <HuAction onClick={onClick} />;
  if (name === "Skip") return <SkipAction onClick={onClick} />;
  return null;
};

export default Action;
