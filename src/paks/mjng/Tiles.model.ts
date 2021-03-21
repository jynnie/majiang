import { Card } from "engine/CardPakTypes";

export interface Tile extends Card {
  value: number | string;
  defaultParams: { suit: string };
  params?: { suit: string; hide?: boolean };
  justDrawn?: boolean;
}
