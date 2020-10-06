import React from "react";
import Box from "ui-box";
import classnames from "classnames";

import { WindChinese } from "../ZhongWenHelpers";

import Tile from "../../components/Tile/Tile";

import "./Centerpiece.css";

const Centerpiece = ({
  data,
  wind = "east",
  tilesRemaining = 0,
  lastPlayed,
  ...props
}) => {
  return (
    <Box className="Centerpiece">
      {data.map((p) => (
        <Box
          className={
            "Centerpiece-playedTiles Centerpiece-tile-" + p.orientation
          }
        >
          {p.playedTiles.map((t) => (
            <Tile.Open
              className={classnames({
                isLastPlayed: lastPlayed?.card.id === t.id,
              })}
              key={t.id}
              face={t.visual}
            />
          ))}
        </Box>
      ))}

      <Box className="Centerpiece-square Centerpiece-cut">
        <Box className="Centerpiece-squareCut Centerpiece-innerCut">
          <Box className="Centerpiece-squareCut Centerpiece-cut">
            <Box className="Centerpiece-squareCut Centerpiece-innerCut" />
          </Box>
        </Box>

        {data.map((p) => (
          <Box
            className={classnames(
              "Centerpiece-turn",
              "Centerpiece-turn-" + p.orientation,
              {
                "Centerpiece-isTurn": p.isTurn,
              },
            )}
          />
        ))}

        <Box className="Centerpiece-wind">
          <Box className="Centerpiece-wind-CN">{WindChinese[wind]}</Box>
          <Box className="Centerpiece-wind-EN">{wind}</Box>
          <Box className="Centerpiece-wind-EN">{wind}</Box>
        </Box>

        <Box className="Centerpiece-tilesRemaining">{tilesRemaining}</Box>
        <Box className="Centerpiece-tilesRemaining">{tilesRemaining}</Box>
      </Box>
    </Box>
  );
};

export default Centerpiece;
