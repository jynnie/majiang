import React from "react";
import Box from "ui-box";

import { WindChinese } from "../ZhongWenHelpers";

import "./Centerpiece.css";

const Centerpiece = ({ data, wind = "east", ...props }) => {
  console.log(data);

  return (
    <Box className="Centerpiece">
      {/* {data.map(p => )} */}
      <Box className="Centerpiece-square Centerpiece-cut">
        <Box className="Centerpiece-squareCut Centerpiece-innerCut">
          <Box className="Centerpiece-squareCut Centerpiece-cut">
            <Box className="Centerpiece-squareCut Centerpiece-innerCut" />
          </Box>
        </Box>

        <Box className="Centerpiece-wind">
          <Box className="Centerpiece-wind-CN">{WindChinese[wind]}</Box>
          <Box className="Centerpiece-wind-EN">{wind}</Box>
          <Box className="Centerpiece-wind-EN">{wind}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Centerpiece;
