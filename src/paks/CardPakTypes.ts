export interface Deck {
  visualDeckId: string;
  cards: Card[];
}

export interface Card {
  id: string | number;
  name?: string;
  defaultParams: any;
  value: number | string | null;

  visualCardIndex?: number;
  instanceId?: string;
  params?: any;
}

export interface VisualDeck {
  id: string;
  name: string;
  description: string;
  visualCards: string[];
  colors?: any;
}

export interface VisualCard {
  id: string;
  name?: string;
  svg: any;
  colors?: [];
}

export interface Rules {
  minSeats: number;
  maxSeats: number;
  turnBased: boolean;
  automaticWin: boolean;

  gameParams: any;
  playerParams: any;

  onTurnStart: () => {};
  onTurnEnd: () => {};
  onGameEnd: () => {};

  playerActions: Action[];
}

export interface Action {
  name: string;
  isAvailable: () => boolean;
  onExecute: () => {};
}
