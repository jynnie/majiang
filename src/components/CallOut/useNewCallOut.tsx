import { useEffect, useState } from "react";
import useSound from "use-sound";

import "./CallOut.css";

const TILE_SFX = require("sounds/tile-place.mp3");

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
  const [play] = useSound(TILE_SFX);

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
        play();
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
