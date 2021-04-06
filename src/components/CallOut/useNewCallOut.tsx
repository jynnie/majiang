import { useEffect, useState } from "react";

import "./CallOut.css";

interface Callout {
  uid?: string;
  seat?: number;
  id: number | string;
  name: string;
}

export function useNewCallout({
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

export default useNewCallout;
