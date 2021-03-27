import CardPak from "engine/CardPak";
import { Action, ActionParams, Card } from "engine/CardPakTypes";
import { oVal, sum } from "utils";

import { makeTiles } from "./Tiles";
import { Tile } from "./Tiles.model";

import type { Deck, Rules } from "engine/CardPakTypes";
import type { GameEngine } from "engine/GameEngine";

/**
 * Base Rule Set
 *
 * This is the basic infrastructure for a
 * Majiang rule set.
 * @class
 */
class Majiang extends CardPak {
  deck: Deck = {
    visualDeckId: "dx-traditional",
    cards: makeTiles(),
  };
  rules: Rules = {
    minSeats: 3,
    maxSeats: 4,
    turnBased: true,
    automaticWin: false,

    gameParams: {
      wall: [],
      deadWall: [],
      lastPlay: null,
    },
    playerParams: {
      closedHand: [], // Tiles in any order
      openHand: {}, // Array of tiles open to be seen, grouped by meld
      playedTiles: [],
      points: 0,
      skipped: false,
      winner: false,
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

      const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
      const playerParams = gameEngine.getPlayerParams(executingPlayerId);
      if (!isMyTurn || !card) return;

      const hasAFullHand = this.hasAFullHand(playerParams);
      const tileIsInClosedHand = !!playerParams.closedHand.find(
        (c: Card) => c.id === card.id,
      );
      if (!hasAFullHand || !tileIsInClosedHand) return;

      // Remove card from hand to played
      const closedHand = playerParams.closedHand
        .filter((c: Card) => c.id !== card.id)
        .map((t: Card) => ({ ...t, justDrawn: false }));
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
      //* Draw
      {
        name: "Draw",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          const hasAFullHand = this.hasAFullHand(playerParams);

          const awaitingNoOne = this.onlyMyActionOrEveryoneSkipped({
            executingPlayerId,
            gameEngine,
          });

          if (!isMyTurn || hasAFullHand || !awaitingNoOne) return false;
          return true;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          const wall: Card[] = gameEngine.gameParams?.wall;
          const drawnTile = wall.shift();
          const closedHand = [
            ...playerParams.closedHand,
            { ...drawnTile, justDrawn: true },
          ];

          const newPlayerParams = { closedHand };

          this.resetSkips(gameEngine);
          gameEngine.updateGameParams({ wall });
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateReact();
        },
      },
    ],
  };

  FULL_HAND_SIZE = 14;

  constructor(props: any, id: string) {
    super(props, id);
  }

  //* Helper Methods
  endGame = (
    gameEngine: GameEngine,
    winnerId?: string,
    winnerNewParams?: any,
  ) => {
    if (winnerId) {
      const playerParams = gameEngine.getPlayerParams(winnerId);
      const points = playerParams.points + 1;
      const newWinnerParams = { points, ...winnerNewParams, winner: true };
      gameEngine.updatePlayer(winnerId, newWinnerParams);
    }

    const seatTurn = ((gameEngine.gameParams?.seatTurn || 0) + 1) % 4;
    const newGameParams = { lastPlay: null, seatTurn };
    gameEngine.updateGameParams(newGameParams);
    gameEngine.endGame();
  };

  //* Helper Setters
  resetSkips = (gameEngine: ActionParams["gameEngine"]) => {
    gameEngine.players.forEach((player) =>
      gameEngine.updatePlayer(player.id, { skipped: false }),
    );
  };

  removeLastPlayedTile = ({ gameEngine }: ActionParams) => {
    const lastPlay = gameEngine.gameParams?.lastPlay;

    const playedPlayerParams = gameEngine.getPlayerParams(lastPlay.by);
    const playedTiles = playedPlayerParams.playedTiles.filter(
      (t: Card) => t.id !== lastPlay.card.id,
    );
    const newPlayedPlayerParams = { ...playedPlayerParams, playedTiles };
    gameEngine.updatePlayer(lastPlay.by, newPlayedPlayerParams);
  };

  createOpenHandWith = (playerParams: any, meld: any[]) => {
    const openHand = { ...playerParams.openHand };
    openHand[oVal(playerParams.openHand).length] = meld;
    return openHand;
  };

  //* Helper Getters
  hasAFullHand = ({ closedHand, openHand }: any) => {
    return closedHand.length + oVal(openHand).length * 3 >= this.FULL_HAND_SIZE;
  };

  getOpenHand = (player: any) => {
    return player.openHand ? oVal(player.openHand) : [];
  };

  getAvailableActions = ({ executingPlayerId, gameEngine }: ActionParams) => {
    const ignoreTheseActions = ["Skip", "Draw"];
    const searchActions = this.rules.playerActions.filter(
      (a) => !ignoreTheseActions.includes(a.name),
    );

    const availableActions: Action[] = [];
    searchActions?.forEach((action) => {
      const isAvailable = action.isAvailable({
        executingPlayerId,
        gameEngine,
      });
      if (isAvailable) availableActions.push(action);
    });

    return availableActions;
  };

  onlyMyActionOrEveryoneSkipped = ({
    executingPlayerId,
    gameEngine,
  }: ActionParams) => {
    const players: any[] = gameEngine.playerParams as any;
    if (!players) return null;

    const playersReady = players
      .filter((p) => p.id !== executingPlayerId)
      .map((p) => {
        const actions = this.getAvailableActions({
          executingPlayerId: p.id,
          gameEngine,
        });
        const skipped = p.skipped;
        return actions.length === 0 || skipped;
      });
    return sum(playersReady) === players.length - 1;
  };

  canAnyoneElse = (
    actionName: string,
    { executingPlayerId, gameEngine }: ActionParams,
  ) => {
    const players: any[] = gameEngine.playerParams as any;
    if (!players) return null;

    const action = this.rules.playerActions.find((a) => a.name === actionName);
    const playersThatCan = players
      .filter((p) => p.id !== executingPlayerId)
      .map((p) => {
        const isAvailable = action?.isAvailable({
          executingPlayerId: p.id,
          gameEngine,
        });
        const skipped = p.skipped;
        return isAvailable && !skipped;
      });
    return sum(playersThatCan) > 0;
  };

  getWinner = (gameEngine: GameEngine) => {
    const players: any[] = gameEngine.playerParams as any;
    if (!players) return null;

    const winner = players.filter((p) => p.winner);
    return winner;
  };

  //* Helpers Filters
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

export default Majiang;
