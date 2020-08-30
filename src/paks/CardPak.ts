/**
 * Basic Card Pak
 *
 * All card paks are made from these
 */

import { Deck, Rules } from "./CardPakTypes";

class CardPak {
  id = "";
  deck: Deck | null = null;
  rules: Rules | null = null;

  constructor(props: any, id: string) {
    this.id = id;
  }

  setup = () => {};
}

export default CardPak;
