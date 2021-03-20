import { Card, Deck, Rules } from "engine/CardPakTypes";

export interface DianXinDeck extends Deck {
  cards: Tile[];
}

export interface Tile extends Card {
  value: number | string;
  defaultParams: { suit: string };
  params?: { suit: string; hide?: boolean };
  justDrawn?: boolean;
}

export interface DianXinPlayerParams {
  closedHand: Tile[];
  openHand: { [key: string]: Tile[] };
  playedTiles: Tile[];
  points: number;
  skipped: boolean;
}

export interface InitializedPlayerParam extends DianXinPlayerParams {
  id: string;
  name: string;
}

export interface DianXinGameParams {
  wall: Tile[];
  deadWall: Tile[];
  lastPlay: { by: string; card: Tile } | null;
}

export interface DianXinRules extends Rules {
  gameParams: DianXinGameParams;
  playerParams: DianXinPlayerParams;
}
