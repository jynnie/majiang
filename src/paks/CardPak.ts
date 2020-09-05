/**
 * Basic Card Pak
 *
 * All card paks are made from these
 */

import { Deck, Card, Rules } from "./CardPakTypes";
import { DianXinDefault } from "../paks/mhjng/VisualDeck";

import { shuffle } from "../utils";

class CardPak {
  id = "";
  deck: Deck | null = null;
  rules: Rules | null = null;

  constructor(props: any, id: string) {
    this.id = id;
  }

  setup = () => {};

  get cards() {
    return this.deck;
  }

  get visualCards() {
    if (!this.deck) return null;

    return this.deck.cards.map(
      (tile) => DianXinDefault.visualCards[tile.visualCardIndex],
    );
  }

  getVisualsOf = (hand: Card[]) => {
    return hand.map((tile) => ({
      ...tile,
      visual: DianXinDefault.visualCards[tile.visualCardIndex],
    }));
  };

  get shuffledDeck() {
    if (!this.deck) return [];

    const cardsCopy = this.deck.cards;
    return shuffle(cardsCopy);
  }
}

export default CardPak;
