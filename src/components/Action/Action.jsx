import React from "react";

import {
  DrawAction,
  ChiAction,
  PengAction,
  GangAction,
  HuAction,
  SkipAction,
} from "./AnAction";

const Action = ({ name, onClick }) => {
  if (name === "Draw") return <DrawAction onClick={onClick} />;
  if (name.includes("Chi"))
    return <ChiAction onClick={onClick} details={name.slice(4)} />;
  if (name === "Peng") return <PengAction onClick={onClick} />;
  if (name === "Gang") return <GangAction onClick={onClick} />;
  if (name === "Hu") return <HuAction onClick={onClick} />;
  if (name === "Skip") return <SkipAction onClick={onClick} />;
  return null;
};

export default Action;
