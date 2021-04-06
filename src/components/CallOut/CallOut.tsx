import React, { useContext, useEffect, useState } from "react";
import Box from "ui-box";
import { EngineContext } from "App";

import "./CallOut.css";

interface Callout {
  uid?: string;
  seat?: number;
  id: number | string;
  name: string;
}

function useNewCallout({
  lastPlay,
  claimReason,
  seatTurn,
}: {
  lastPlay: any;
  claimReason?: string;
  seatTurn?: number;
}) {
  const [callout, setCallout] = useState<Callout | null>(null);

  useEffect(() => {
    let isDifferent = false;
    if (!callout) isDifferent = true;

    if (lastPlay) {
      if (lastPlay.card.id !== callout?.id) isDifferent = true;
      if (isDifferent) {
        const newCallout = {
          uid: lastPlay.by,
          id: lastPlay.card.id,
          name: `${lastPlay.card.name}`,
        };
        setCallout(newCallout);
      }
    } else if (claimReason) {
      if (claimReason !== callout?.id) isDifferent = true;
      if (isDifferent) {
        const newCallout = {
          seat: seatTurn,
          id: claimReason + seatTurn,
          name: claimReason,
        };
        setCallout(newCallout);
      }
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [lastPlay, claimReason, seatTurn]);

  return callout;
}

export const CallOut = ({ seat, uid }: { seat: number; uid: string }) => {
  const { GE } = useContext(EngineContext);

  const lastPlay = GE?.gameParams?.lastPlay;
  const claimReason = GE?.gameParams?.seatReason;
  const seatTurn = GE?.gameParams?.seatTurn;
  const isCalledOut = !!lastPlay || !!claimReason;

  const callout = useNewCallout({ lastPlay, claimReason, seatTurn });
  const isThisSeatsCallout = callout?.uid === uid || callout?.seat === seat;
  // console.log(callout, isThisSeatsCallout);

  if (!isCalledOut || !callout || !isThisSeatsCallout) return null;
  return (
    <Box key={callout.id} className="CallOut-container">
      {callout.name}
    </Box>
  );
};

export default CallOut;
