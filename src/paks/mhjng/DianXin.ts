/**
 * DianXin 点心
 *
 * This is the most basic version of Chinese mahjong,
 * based off of Cantonese rules.
 */

import CardPak from "../CardPak";
import { Card, Deck, Rules, Action, ActionParams } from "../CardPakTypes";

// TODO: Deal with conflicting Peng vs Draw
// TODO: Deal with conflicting Peng vs Chi

const NUMBER_TILES = [
  {
    name: "yibing",
    defaultParams: { suit: "tong" },
    value: 1,
    visualCardIndex: 18,
  },
  {
    name: "ertong",
    defaultParams: { suit: "tong" },
    value: 2,
    visualCardIndex: 19,
  },
  {
    name: "santong",
    defaultParams: { suit: "tong" },
    value: 3,
    visualCardIndex: 20,
  },
  {
    name: "sitong",
    defaultParams: { suit: "tong" },
    value: 4,
    visualCardIndex: 21,
  },
  {
    name: "wutong",
    defaultParams: { suit: "tong" },
    value: 5,
    visualCardIndex: 22,
  },
  {
    name: "liutong",
    defaultParams: { suit: "tong" },
    value: 6,
    visualCardIndex: 23,
  },
  {
    name: "qitong",
    defaultParams: { suit: "tong" },
    value: 7,
    visualCardIndex: 24,
  },
  {
    name: "batong",
    defaultParams: { suit: "tong" },
    value: 8,
    visualCardIndex: 25,
  },
  {
    name: "jiutong",
    defaultParams: { suit: "tong" },
    value: 9,
    visualCardIndex: 26,
  },

  {
    name: "yiwan",
    defaultParams: { suit: "wan" },
    value: 1,
    visualCardIndex: 0,
  },
  {
    name: "erwan",
    defaultParams: { suit: "wan" },
    value: 2,
    visualCardIndex: 1,
  },
  {
    name: "sanwan",
    defaultParams: { suit: "wan" },
    value: 3,
    visualCardIndex: 2,
  },
  {
    name: "siwan",
    defaultParams: { suit: "wan" },
    value: 4,
    visualCardIndex: 3,
  },
  {
    name: "wuwan",
    defaultParams: { suit: "wan" },
    value: 5,
    visualCardIndex: 4,
  },
  {
    name: "liuwan",
    defaultParams: { suit: "wan" },
    value: 6,
    visualCardIndex: 5,
  },
  {
    name: "qiwan",
    defaultParams: { suit: "wan" },
    value: 7,
    visualCardIndex: 6,
  },
  {
    name: "bawan",
    defaultParams: { suit: "wan" },
    value: 8,
    visualCardIndex: 7,
  },
  {
    name: "jiuwan",
    defaultParams: { suit: "wan" },
    value: 9,
    visualCardIndex: 8,
  },

  {
    name: "yaoji",
    defaultParams: { suit: "tiao" },
    value: 1,
    visualCardIndex: 9,
  },
  {
    name: "liangtiao",
    defaultParams: { suit: "tiao" },
    value: 2,
    visualCardIndex: 10,
  },
  {
    name: "santiao",
    defaultParams: { suit: "tiao" },
    value: 3,
    visualCardIndex: 11,
  },
  {
    name: "sitiao",
    defaultParams: { suit: "tiao" },
    value: 4,
    visualCardIndex: 12,
  },
  {
    name: "wutiao",
    defaultParams: { suit: "tiao" },
    value: 5,
    visualCardIndex: 13,
  },
  {
    name: "liutiao",
    defaultParams: { suit: "tiao" },
    value: 6,
    visualCardIndex: 14,
  },
  {
    name: "qitiao",
    defaultParams: { suit: "tiao" },
    value: 7,
    visualCardIndex: 15,
  },
  {
    name: "batiao",
    defaultParams: { suit: "tiao" },
    value: 8,
    visualCardIndex: 16,
  },
  {
    name: "jiutiao",
    defaultParams: { suit: "tiao" },
    value: 9,
    visualCardIndex: 17,
  },
];

const DRAGON_WIND_TILES = [
  {
    name: "dong",
    defaultParams: { suit: "feng" },
    value: "east",
    visualCardIndex: 27,
  },
  {
    name: "nan",
    defaultParams: { suit: "feng" },
    value: "south",
    visualCardIndex: 28,
  },
  {
    name: "xi",
    defaultParams: { suit: "feng" },
    value: "west",
    visualCardIndex: 29,
  },
  {
    name: "bei",
    defaultParams: { suit: "feng" },
    value: "north",
    visualCardIndex: 30,
  },

  {
    name: "hongzhong",
    defaultParams: { suit: "long" },
    value: "hongzhong",
    visualCardIndex: 31,
  },
  {
    name: "facai",
    defaultParams: { suit: "long" },
    value: "facai",
    visualCardIndex: 32,
  },
  {
    name: "baiban",
    defaultParams: { suit: "long" },
    value: "baiban",
    visualCardIndex: 33,
  },
];

const TILES = [...NUMBER_TILES, ...DRAGON_WIND_TILES];

const makeTiles = () => {
  const fourOfEachTile = [...TILES, ...TILES, ...TILES, ...TILES];
  return fourOfEachTile.map((tile, i) => ({
    id: i,
    ...tile,
  }));
};

//---------------------------------------#262C86
interface DianXinDeck extends Deck {
  cards: Tile[];
}

interface Tile extends Card {
  value: number | string;
  defaultParams: { suit: string };
  params?: { suit: string };
}

interface NumberTile extends Tile {
  value: number;
}

interface DianXinPlayerParams {
  closedHand: Tile[];
  openHand: Tile[][];
  playedTiles: Tile[];
  points: number;
}

interface DianXinGameParams {
  wall: Tile[];
  deadWall: Tile[];
  lastPlay?: { by: string; card: Tile };
}

interface DianXinRules extends Rules {
  gameParams: DianXinGameParams;
  playerParams: DianXinPlayerParams;
}

//---------------------------------------#262C86
class DianXin extends CardPak {
  deck: DianXinDeck = {
    visualDeckId: "dx-traditional",
    cards: makeTiles(),
  };
  rules: DianXinRules = {
    minSeats: 3,
    maxSeats: 4,
    turnBased: true,
    automaticWin: false,

    gameParams: {
      wall: [],
      deadWall: [],
      lastPlay: undefined,
    },
    playerParams: {
      closedHand: [], // Tiles in any order
      openHand: [], // Array of tiles open to be seen, grouped by meld
      playedTiles: [],
      points: 0,
    },

    onGameStart: (gameEngine) => {
      const shuffledDeck = this.shuffledDeck.map((tile) => ({
        ...tile,
        params: tile.defaultParams,
      }));

      // Deal tiles to walls
      const deadWallStart = shuffledDeck.length - 14;
      let wall = shuffledDeck?.slice(0, deadWallStart);
      let deadWall = shuffledDeck?.slice(deadWallStart);

      // Draw tiles from walls
      gameEngine.playerParams?.forEach((player: any) => {
        const playerHand = wall.slice(0, 13);
        wall = wall.slice(13, deadWallStart);
        gameEngine.updatePlayer(player.id, {
          ...player,
          closedHand: playerHand,
        });
      });

      // Set Game Params
      gameEngine.updateGameParams({ wall, deadWall });
    },
    onTurnStart: () => {},
    onTurnEnd: () => {},
    onGameEnd: () => {},
    onCardClick: ({ executingPlayerId, card, gameEngine }) => {
      if (!executingPlayerId) return;

      // TODO: Should cardClick also handle Peng etc?

      // FIXME: switch to get isMyTurn
      const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
      const playerParams = gameEngine.getPlayerParams(executingPlayerId);
      if (!isMyTurn || !card) return;

      const hasAFullHand = this.hasAFullHand(playerParams);
      const tileIsInClosedHand = !!playerParams.closedHand.find(
        (c: Card) => c.id === card.id,
      );
      if (!hasAFullHand || !tileIsInClosedHand) return;

      // Remove card from hand to played
      const closedHand = playerParams.closedHand.filter(
        (c: Card) => c.id !== card.id,
      );
      const playedTiles = [...playerParams.playedTiles, card];
      const newPlayerParams = {
        ...playerParams,
        closedHand,
        playedTiles,
      };

      gameEngine.updateGameParams({
        lastPlay: { card, by: executingPlayerId },
      });
      gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
      gameEngine.finishTurn();
    },

    playerActions: [
      {
        name: "Draw",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          // FIXME: Need to also check the openHand
          const hasAFullHand = this.hasAFullHand(playerParams);

          if (!isMyTurn || hasAFullHand) return false;
          return true;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          const wall: Card[] = gameEngine.gameParams.wall;
          const drawnTile = wall.shift();
          const closedHand = [...playerParams.closedHand, drawnTile];

          const newPlayerParams = { ...playerParams, closedHand };

          gameEngine.updateGameParams({ wall });
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateReact();
        },
      },
      {
        name: "Peng",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // FIXME: switch to get myParams
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const lastPlay = gameEngine.gameParams.lastPlay;
          const makesAMeld = this.canIPeng(playerParams, lastPlay);
          const hasFullHand = this.hasAFullHand(playerParams);

          return makesAMeld && !hasFullHand;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const lastPlay = gameEngine.gameParams.lastPlay;
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          // Remove the tile from playedTiles of other player
          this.removeLastPlayedTile({ executingPlayerId, gameEngine });

          // Put the tile and your matching tiles in openHand
          const matching = playerParams.closedHand
            .filter(this.matchInValueAndSuit(lastPlay.card))
            .slice(0, 2);
          const meld = [lastPlay.card, ...matching];
          const openHand = [...playerParams.openHand, meld];
          const closedHand = playerParams.closedHand.filter(
            (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
          );
          const newPlayerParams = { ...playerParams, openHand, closedHand };

          // Update params
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateGameParams({ lastPlay: undefined });
          gameEngine.claimTurn(executingPlayerId);
        },
      },
      {
        name: "Gang",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // FIXME: switch to get myParams
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const lastPlay = gameEngine.gameParams.lastPlay;
          const makesAMeld = this.canIGang(playerParams, lastPlay);
          const hasFullHand = this.hasAFullHand(playerParams);

          return makesAMeld && !hasFullHand;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const lastPlay = gameEngine.gameParams.lastPlay;
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          // Remove the tile from playedTiles of other player
          this.removeLastPlayedTile({ executingPlayerId, gameEngine });

          // Put the tile and your matching tiles in openHand
          const matching = playerParams.closedHand.filter(
            this.matchInValueAndSuit(lastPlay.card),
          );
          const meld = [lastPlay.card, ...matching];
          const openHand = [...playerParams.openHand, meld];
          const closedHand = playerParams.closedHand.filter(
            (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
          );

          // Draw another tile
          const deadWall: Card[] = gameEngine.gameParams.deadWall;
          const drawnTile = deadWall.shift();
          closedHand.push(drawnTile);
          const newPlayerParams = { ...playerParams, openHand, closedHand };

          // Update params
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateGameParams({ lastPlay: undefined, deadWall });
          gameEngine.claimTurn(executingPlayerId);
        },
      },
      {
        name: "Chi",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const lastPlay = gameEngine.gameParams.lastPlay;
          if (!lastPlay) return false;

          // Was last play was by the previous player
          const lastPlayerParams = gameEngine.getPlayerParams(lastPlay?.by);
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const lastWasRightBeforeMe =
            (playerParams.seat - lastPlayerParams.seat + 4) % 4 === 1;
          if (!lastWasRightBeforeMe) return false;

          // Does it finish one of your melds?
          const makesAMeld = this.canIChi(playerParams, lastPlay);
          if (!makesAMeld) return false;

          // Make array of actions from ones that start a meld
          const availableMelds: Action[] = makesAMeld.map((startTile) => ({
            name: `Chi ${startTile.value} ${Number(startTile.value) + 1} ${
              Number(startTile.value) + 2
            }`,
            isAvailable: () => true,
            onExecute: ({ executingPlayerId, gameEngine }) => {
              const lastPlay = gameEngine.gameParams.lastPlay;
              const playerParams = gameEngine.getPlayerParams(
                executingPlayerId,
              );

              // Remove the tile from playedTiles of other player
              this.removeLastPlayedTile({ executingPlayerId, gameEngine });

              // Put the tile and your matching tiles in openHand
              const meld = [lastPlay.card, ...playerParams.closedHand].filter(
                this.matchStaircaseStartingAt(startTile),
              );
              const openHand = [...playerParams.openHand, meld];
              const closedHand = playerParams.closedHand.filter(
                (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
              );
              const newPlayerParams = { ...playerParams, openHand, closedHand };

              // Update params
              gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
              gameEngine.updateGameParams({ lastPlay: undefined });
              gameEngine.claimTurn(executingPlayerId);
            },
          }));
          return availableMelds;
        },
        onExecute: () => {},
      },
      {
        name: "Hu",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // FIXME: switch to get myParams
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          return false;
        },
        onExecute: () => {},
      },
    ],
  };

  FULL_HAND_SIZE = 14;

  constructor(props: any) {
    super(props, "mhjng-dianxin");
  }

  //---------------------------------------#262C86
  //- Helper Setters
  removeLastPlayedTile = ({ gameEngine }: ActionParams) => {
    const lastPlay = gameEngine.gameParams.lastPlay;

    const playedPlayerParams = gameEngine.getPlayerParams(lastPlay.by);
    const playedTiles = playedPlayerParams.playedTiles.filter(
      (t: Card) => t.id !== lastPlay.card.id,
    );
    const newPlayedPlayerParams = { ...playedPlayerParams, playedTiles };
    gameEngine.updatePlayer(lastPlay.by, newPlayedPlayerParams);
  };

  //---------------------------------------#262C86
  //- Helper Getters
  hasAFullHand = ({ closedHand, openHand }: DianXinPlayerParams) => {
    return closedHand.length + openHand.length * 3 >= this.FULL_HAND_SIZE;
  };

  canIPeng = (
    { closedHand }: DianXinPlayerParams,
    lastPlay: DianXinGameParams["lastPlay"],
  ) => {
    if (!lastPlay) return false;

    const tile = lastPlay.card;
    const matching = closedHand.filter(this.matchInValueAndSuit(tile));
    return matching.length >= 2;
  };

  canIGang = (
    { closedHand }: DianXinPlayerParams,
    lastPlay: DianXinGameParams["lastPlay"],
  ) => {
    if (!lastPlay) return false;

    const tile = lastPlay.card;
    const matching = closedHand.filter(this.matchInValueAndSuit(tile));
    return matching.length >= 3;
  };

  canIChi = (
    { closedHand }: DianXinPlayerParams,
    lastPlay: DianXinGameParams["lastPlay"],
  ) => {
    if (!lastPlay) return false;
    if (typeof lastPlay.card.value !== "number") return false;

    const tile = lastPlay.card;
    const matchingSuit = closedHand.filter(this.matchInSuit(tile));
    const withinTwo = matchingSuit.filter(this.matchValueWithinTwo(tile));

    const possibleChis = [...withinTwo, tile]
      .sort((a, b) => Number(a.value) - Number(b.value))
      .filter(
        (startingTile, i, self) =>
          typeof startingTile.value === "number" &&
          this.valueInArray(startingTile.value + 1, self) &&
          this.valueInArray(startingTile.value + 2, self) &&
          this.firstOne(startingTile, i, self),
      );

    return possibleChis;
  };

  //---------------------------------------#262C86
  //- Helpers Filters
  firstOne = (
    tile: {
      value: number | string;
      params?: { suit?: string };
    },
    index: number,
    self: Tile[],
  ) =>
    index ===
    self.findIndex(
      (t) => t.value === tile.value && t.params?.suit === tile.params?.suit,
    );

  valueInArray = (value: number | string, array: Tile[]) => {
    return array.findIndex((t) => t.value === value) > -1;
  };

  matchInSuit = (tile: Card) => {
    return (t: Card) => t.params.suit === tile.params.suit;
  };

  matchValueWithinTwo = (tile: Card) => {
    const lowerBound = Number(tile.value) - 2;
    const upperBound = Number(tile.value) + 2;
    return (t: Card) =>
      Number(t.value) >= lowerBound && Number(t.value) <= upperBound;
  };

  matchInValueAndSuit = (tile: {
    value: number | string;
    params?: { suit?: string };
  }) => {
    return (t: Card) =>
      t.value === tile.value && t.params.suit === tile.params?.suit;
  };

  firstMatchInValueAndSuit = (tile: {
    value: number | string;
    params?: { suit?: string };
  }) => {
    console.log(
      "Looking for a first match with",
      tile.value,
      tile.params?.suit,
    );
    return (t: Card, index: number, self: Tile[]) =>
      t.value === tile.value &&
      t.params.suit === tile.params?.suit &&
      this.firstOne(tile, index, self);
  };

  matchStaircaseStartingAt = (startTile: Tile) => (
    t: Tile,
    i: number,
    self: Tile[],
  ) =>
    this.firstMatchInValueAndSuit({
      value: startTile.value,
      params: { suit: startTile.params?.suit },
    })(t, i, self) ||
    this.firstMatchInValueAndSuit({
      value: Number(startTile.value) + 1,
      params: { suit: startTile.params?.suit },
    })(t, i, self) ||
    this.firstMatchInValueAndSuit({
      value: Number(startTile.value) + 2,
      params: { suit: startTile.params?.suit },
    })(t, i, self);
}

export default DianXin;
