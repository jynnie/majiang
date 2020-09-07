/**
 * DianXin 点心
 *
 * This is the most basic version of Chinese mahjong,
 * based off of Cantonese rules.
 */

import CardPak from "../CardPak";
import { Card, Deck, Rules, Action, ActionParams } from "../CardPakTypes";

import { sum } from "../../utils";

// TODO: Deal with conflicting Peng vs Draw
// TODO: Deal with conflicting Peng vs Chi
// TODO: Deal with conflicting X vs Hu

//---------------------------------------#00D4B2
//- TILES
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

//---------------------------------------#00D4B2
//- INTERFACES
interface DianXinDeck extends Deck {
  cards: Tile[];
}

interface Tile extends Card {
  value: number | string;
  defaultParams: { suit: string };
  params?: { suit: string; hide?: boolean };
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

interface HandMatrix {
  [suit: string]: { [key: string]: number };
}

//---------------------------------------#00D4B2
//- TILE MATRIX
interface TotalsMatrix {
  [key: string]: {
    suit: string;
    total: number;
    hasPair: boolean;
    tm3: boolean;
  };
}

/**
 * TileMatrix handles a lot of the logic
 * of determining whether a hand has proper
 * melds.
 */
class TileMatrix {
  handMatrix: HandMatrix = {
    tiao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    tong: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    wan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    feng: { dong: 0, nan: 0, xi: 0, bei: 0 },
    long: { facai: 0, hongzhong: 0, baiban: 0 },
  };

  NUMBERED_SUITS = ["tong", "tiao", "wan"];
  WIND_N_DRAGON_SUITS = ["feng", "long"];

  constructor(closedHand: Tile[]) {
    console.log(closedHand);
    closedHand.map((tile) => {
      if (tile.params?.suit) this.handMatrix[tile.params.suit][tile.value] += 1;
    });
  }

  get isWinnable() {
    const windNDragonsOk = this.checkWindsNDragons();
    // console.log("👀", "Winds n dragons", windNDragonsOk);
    if (windNDragonsOk === false) return false;

    const totalsMatrix = this.checkTotals();
    // console.log("👀", "Totals", totalsMatrix);
    if (totalsMatrix === false) return false;

    const meldsOk = this.checkMelds(totalsMatrix);
    // console.log("👀", "Melds", meldsOk);
    return meldsOk;
  }

  checkWindsNDragons = () => {
    // Make sure all the fengs & longs are part melds
    let windsNDragonsOk = true;
    this.WIND_N_DRAGON_SUITS.forEach((suit) => {
      Object.values(this.handMatrix[suit]).forEach((tileType) => {
        if (tileType !== 3 && tileType !== 0) {
          windsNDragonsOk = false;
          return false;
        }
      });
    });
    return windsNDragonsOk;
  };

  checkTotals = () => {
    // Get totals for each suit and see if they match up
    const totalsMatrix: TotalsMatrix = {};
    // console.log("👀", this.handMatrix);

    this.NUMBERED_SUITS.forEach((suit) => {
      const suitTotal = sum(Object.values(this.handMatrix[suit]));
      totalsMatrix[suit] = {
        suit,
        total: suitTotal,
        hasPair: (suitTotal - 2) % 3 === 0,
        tm3: suitTotal % 3 === 0,
      };
    });
    const totalsArray = Object.values(totalsMatrix);
    const onlyOnePair = sum(totalsArray.map((m) => m.hasPair)) === 1;
    const allSuitsCouldHaveMelds =
      sum(totalsArray.map((m) => m.tm3)) + Number(onlyOnePair) === 3;
    // console.log("👀", totalsMatrix, onlyOnePair, allSuitsCouldHaveMelds);
    if (!onlyOnePair || !allSuitsCouldHaveMelds) return false;

    return totalsMatrix;
  };

  checkMelds = (totalsMatrix: TotalsMatrix) => {
    // Check the suit with the pair for validity
    let suitWithPairOk = false;
    const suitWithPair = Object.values(totalsMatrix).filter((t) => t.hasPair)[0]
      .suit;
    const tilesWithMoreThanOne = Object.values(
      this.handMatrix[suitWithPair],
    ).reduce((acc: number[], count, i) => (count > 1 ? [...acc, i] : acc), []);
    // console.log("👀", "Suit with pair is", suitWithPair);
    if (tilesWithMoreThanOne.length === 0) return false;
    // For all possible pairs, remove the pair and
    // check if the remaining tiles fit into melds
    tilesWithMoreThanOne.forEach((tile) => {
      const suitMatrix = Object.values(this.handMatrix[suitWithPair]);
      suitMatrix[tile] -= 2;
      const suitOk = this.checkMeldsInSuit(
        totalsMatrix[suitWithPair].total,
        suitMatrix,
      );

      // As long as one permutation of removing a
      // pair works, then this suit is okay.
      if (suitOk) {
        suitWithPairOk = true;
        return true;
      }
    });
    // console.log("👀", "Suit with pair okay", suitWithPairOk);
    if (suitWithPairOk === false) return false;

    // Check the other suits for validity
    let suitsOkay = true;
    this.NUMBERED_SUITS.filter((suit) => suit !== suitWithPair).forEach(
      (suit) => {
        const suitOk = this.checkMeldsInSuit(
          totalsMatrix[suit].total,
          Object.values(this.handMatrix[suit]),
        );

        if (suitOk === false) {
          // console.log("👀", "Suit failed", suit);
          suitsOkay = false;
          return false;
        }
      },
    );
    return suitsOkay;
  };

  checkMeldsInSuit = (suitTotal: number, suitMatrix: number[]) => {
    if (suitTotal > 0) {
      // Remove pengs
      suitMatrix = suitMatrix.map((tile) => tile % 3);

      // Try staircases
      let staircaseMatrix = suitMatrix.map((_) => 0);
      let i = 0;
      for (let loops = 0; loops <= suitTotal / 3; loops++) {
        if (suitMatrix[i] && suitMatrix[i + 1] && suitMatrix[i + 2]) {
          if (staircaseMatrix[i]) staircaseMatrix[i] += 1;
          else staircaseMatrix[i] = 1;
          suitMatrix[i] -= 1;
          suitMatrix[i + 1] -= 1;
          suitMatrix[i + 2] -= 1;
        } else staircaseMatrix[i] = 0;

        if (suitMatrix[i] === 0) i += 1;
      }
      // console.log("👀", "staircase", staircaseMatrix);
      // console.log("👀", "suitMatrix", suitMatrix, sum(suitMatrix));

      // If after trying to put together melds, we have extra
      // then this suit doesn't turn into good melds
      return sum(suitMatrix) === 0;
    }
    return true;
  };
}

//---------------------------------------#00D4B2
//- MAIN CLASS RULES
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
      // FIXME: Unseed hand
      const shuffledDeck = this.shuffledDeck.map((tile) => ({
        ...tile,
        params: tile.defaultParams,
      }));
      // const shuffledDeck = this.deck.cards
      //   .map((tile) => ({
      //     ...tile,
      //     params: tile.defaultParams,
      //   }))
      //   .sort((a, b) => (a.params.suit < b.params.suit ? 1 : 0))
      //   .sort((a, b) => Number(a.value) - Number(b.value));

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
      //---------------------------------------#00D4B2
      //- Draw
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
      //---------------------------------------#00D4B2
      //- Peng
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
      //---------------------------------------#00D4B2
      //- Gang
      {
        name: "An Gang",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // FIXME: switch to get myParams
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const makesAMeld = this.canIAnGang(playerParams);
          if (makesAMeld.length === 0 || !isMyTurn) return false;

          const availableMelds: Action[] = makesAMeld.map((tile) => ({
            name: `An Gang ${tile.name}`,
            isAvailable: () => true,
            onExecute: ({ executingPlayerId, gameEngine }) => {
              const playerParams = gameEngine.getPlayerParams(
                executingPlayerId,
              );

              // Put the tile and your matching tiles in openHand
              const meld = playerParams.closedHand
                .filter(this.matchInValueAndSuit(tile))
                .map((t: Tile) => ({ ...t, hide: true }));
              const openHand = [...playerParams.openHand, meld];
              const closedHand = playerParams.closedHand.filter(
                (t: Tile) => meld.findIndex((m: Tile) => m.id === t.id) === -1,
              );

              // Draw another tile
              const deadWall: Card[] = gameEngine.gameParams.deadWall;
              const drawnTile = deadWall.shift();
              closedHand.push(drawnTile);
              const newPlayerParams = { ...playerParams, openHand, closedHand };

              // Update params
              gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
              gameEngine.claimTurn(executingPlayerId);
            },
          }));
          return availableMelds;
        },
        onExecute: () => {},
      },
      //---------------------------------------#00D4B2
      //- An Gang
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
      //---------------------------------------#00D4B2
      //- Chi
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
      //---------------------------------------#00D4B2
      //- Hu
      {
        name: "Hu",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // FIXME: switch to get myParams
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const hasFullHand = this.hasAFullHand(playerParams);
          const lastPlay = gameEngine.gameParams.lastPlay;

          let hand: Tile[] = [];

          // If your closed hand is full, check your closed
          // hand is winnable
          if (hasFullHand) hand = playerParams.closedHand;
          // Otherwise, try adding the last played tile to your
          // hand and see if that makes it a winning thing
          else if (!!lastPlay)
            hand = [lastPlay.card, ...playerParams.closedHand];
          // console.log("👀");
          // console.log("👀", executingPlayerId);

          if (hand.length === 0) return false;

          const tileMatrix = new TileMatrix(hand);
          console.log("👀", executingPlayerId, tileMatrix.isWinnable);
          return tileMatrix.isWinnable;
        },
        onExecute: () => {},
      },
    ],
  };

  FULL_HAND_SIZE = 14;

  constructor(props: any) {
    super(props, "mhjng-dianxin");
  }

  //---------------------------------------#00D4B2
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

  //---------------------------------------#00D4B2
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

  canIAnGang = ({ closedHand }: DianXinPlayerParams) => {
    const matching = closedHand
      .filter(this.firstOne)
      .filter(
        (tile) => closedHand.filter(this.matchInValueAndSuit(tile)).length > 3,
      );
    return matching;
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

  //---------------------------------------#00D4B2
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
