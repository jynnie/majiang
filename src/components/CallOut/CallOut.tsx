import React, { useContext } from "react";
import cn from "classnames";
import Box from "ui-box";
import { EngineContext } from "App";

import useNewCallout from "./useNewCallOut";

import "./CallOut.css";
import Brush from "./Brush";

export const BaseCallOut = ({
  CN,
  EN,
  name,
  showBrush,
}: {
  CN?: string;
  EN: string;
  name: string;
  showBrush: boolean;
}) => {
  return (
    <Box
      className={cn("CallOut-container", {
        "CallOut-tile": !showBrush,
        "CallOut-take": showBrush,
        [`CallOut-${name}`]: showBrush,
      })}
    >
      {CN && <Box className="CallOut-CN">{CN}</Box>}
      <Box className="CallOut-EN">{EN}</Box>
      {showBrush && (
        <Brush
          className={cn("CallOut-brush", {
            [`CallOut-${name}`]: showBrush,
          })}
        />
      )}
    </Box>
  );
};

export const CallOut = ({ seat, uid }: { seat: number; uid: string }) => {
  const { GE } = useContext(EngineContext);

  const lastPlay = GE?.gameParams?.lastPlay;
  const claimReason = GE?.gameParams?.seatReason;
  const seatTurn = GE?.gameParams?.seatTurn;
  const isCalledOut = !!lastPlay || !!claimReason;

  const callout = useNewCallout({ lastPlay, claimReason, seatTurn });
  const isThisSeatsCallout = callout?.uid === uid || callout?.seat === seat;

  if (!isCalledOut || !callout || !isThisSeatsCallout) return null;

  switch (callout?.name) {
    case "chi":
      return (
        <BaseCallOut
          key={callout.id}
          name={callout.name}
          EN="chī"
          CN="吃"
          showBrush={true}
        />
      );
    case "peng":
      return (
        <BaseCallOut
          key={callout.id}
          name={callout.name}
          EN="pÈng"
          CN="碰"
          showBrush={true}
        />
      );
    case "gang":
      return (
        <BaseCallOut
          key={callout.id}
          name={callout.name}
          EN="gÀng"
          CN="槓"
          showBrush={true}
        />
      );
    case "hu":
      return (
        <BaseCallOut
          key={callout.id}
          name={callout.name}
          EN="hÚ"
          CN="和"
          showBrush={true}
        />
      );
    default:
      return (
        <BaseCallOut
          key={callout.id}
          name={callout.name}
          EN={callout.name}
          showBrush={false}
        />
      );
  }
};

export default CallOut;
