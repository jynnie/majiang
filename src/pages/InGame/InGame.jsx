import React, { useContext } from "react";

import { EngineContext } from "../../App";

import Table from "./components/Table";

const GamePage = () => {
  const { GE } = useContext(EngineContext);

  return (
    <>
      <Table players={GE.playerParams} />
    </>
  );
};

export default GamePage;
