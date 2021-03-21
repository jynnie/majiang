import { Deck, Rules } from "engine/CardPakTypes";

import { Tile } from "../Tiles.model";

export interface DianXinDeck extends Deck {
  cards: Tile[];
}

export interface DianXinPlayerParams {
  closedHand: Tile[];
  openHand: { [key: string]: Tile[] };
  playedTiles: Tile[];
  points: number;
  skipped: boolean;
  winner: boolean;
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
