import React, { useContext } from "react";

import { EngineContext } from "App";

import Table from "./components/Table";
import Menu from "./components/Menu";

const GamePage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <>
      <Table players={GE.playerParams} />
      <Menu />
    </>
  );
};

export default GamePage;
