import { Action, Card } from "engine/CardPakTypes";

import Majiang from "../BaseSet";
import { TileMatrix, ConditionFunction } from "../TileMatrix";
import { makeTiles } from "../Tiles";

import {
  ClaimReason,
  DianXinDeck,
  DianXinGameParams,
  DianXinPlayerParams,
  DianXinRules,
} from "./DianXin.model";
import type { Tile } from "../Tiles.model";
import { oVal } from "utils";

/**
 * DianXin 点心
 *
 * This is the most basic version of Chinese majiang,
 * based off of Cantonese rules.
 * @class
 */
class DianXin extends Majiang {
  deck: DianXinDeck = {
    visualDeckId: "dx-traditional",
    cards: makeTiles(),
  };
  additionalWinConditions: ConditionFunction[] = [];
  rules: DianXinRules = {
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
      points: 0, // FIXME: Mark this key as to not reset
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

      const isNoMoreWall = !gameEngine.gameParams?.wall;
      if (isNoMoreWall) {
        setTimeout(() => this.endGame(gameEngine), 1200);
      }
    },

    playerActions: [
      //----------------------------------#01F2DF
      //- Draw
      {
        name: "Draw",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const isWallEmpty = !gameEngine.gameParams?.wall;
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          const hasAFullHand = this.hasAFullHand(playerParams);

          const awaitingNoOne = this.onlyMyActionOrEveryoneSkipped({
            executingPlayerId,
            gameEngine,
          });

          if (isWallEmpty || !isMyTurn || hasAFullHand || !awaitingNoOne)
            return false;
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
      //----------------------------------#01F2DF
      //- Peng
      {
        name: "Peng",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // Deal with conflicting Hu
          const huKing = this.canAnyoneElse("Hu", {
            executingPlayerId,
            gameEngine,
          });
          if (huKing) return false;

          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const lastPlay = gameEngine.gameParams?.lastPlay;
          const notMyPlay = lastPlay?.by !== executingPlayerId;
          const makesAMeld = this.canIPeng(playerParams, lastPlay);
          const hasFullHand = this.hasAFullHand(playerParams);
          const alreadySkipped = playerParams.skipped;

          return notMyPlay && makesAMeld && !hasFullHand && !alreadySkipped;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const lastPlay = gameEngine.gameParams?.lastPlay;
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          // Remove the tile from playedTiles of other player
          this.removeLastPlayedTile({ executingPlayerId, gameEngine });

          // Put the tile and your matching tiles in openHand
          const matching = playerParams.closedHand
            .filter(this.matchInValueAndSuit(lastPlay.card))
            .slice(0, 2);
          const meld = [lastPlay.card, ...matching];
          const openHand = this.createOpenHandWith(playerParams, meld);
          const closedHand = playerParams.closedHand.filter(
            (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
          );
          const newPlayerParams = { openHand, closedHand };

          // Update params
          this.resetSkips(gameEngine);
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateGameParams({ lastPlay: null });
          gameEngine.claimTurn(executingPlayerId, ClaimReason.PENG);
        },
      },
      //----------------------------------#01F2DF
      //- An Gang
      {
        name: "An Gang",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // Deal with conflicting Hu
          const huKing = this.canAnyoneElse("Hu", {
            executingPlayerId,
            gameEngine,
          });
          if (huKing) return false;

          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const alreadySkipped = playerParams.skipped;
          const makesAMeld = this.canIAnGang(playerParams);
          if (makesAMeld.length === 0 || !isMyTurn || alreadySkipped)
            return false;

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
              const openHand = this.createOpenHandWith(playerParams, meld);
              const closedHand = playerParams.closedHand.filter(
                (t: Tile) => meld.findIndex((m: Tile) => m.id === t.id) === -1,
              );

              // Draw another tile
              const deadWall: Card[] = gameEngine.gameParams?.deadWall;
              const drawnTile = deadWall.shift();
              closedHand.push({ ...drawnTile, justDrawn: true });
              const newPlayerParams = { openHand, closedHand };

              // Update params
              this.resetSkips(gameEngine);
              gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
              gameEngine.claimTurn(executingPlayerId, ClaimReason.ANGANG);
            },
          }));
          return availableMelds;
        },
        onExecute: () => {},
      },
      //----------------------------------#01F2DF
      //- Gang
      {
        name: "Gang",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // Deal with conflicting Hu
          const huKing = this.canAnyoneElse("Hu", {
            executingPlayerId,
            gameEngine,
          });
          if (huKing) return false;

          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const lastPlay = gameEngine.gameParams?.lastPlay;
          const makesAMeld = this.canIGang(playerParams, lastPlay);
          const hasFullHand = this.hasAFullHand(playerParams);
          const alreadySkipped = playerParams.skipped;

          return makesAMeld && !hasFullHand && !alreadySkipped;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const lastPlay = gameEngine.gameParams?.lastPlay;
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);

          // Remove the tile from playedTiles of other player
          this.removeLastPlayedTile({ executingPlayerId, gameEngine });

          // Put the tile and your matching tiles in openHand
          const matching = playerParams.closedHand.filter(
            this.matchInValueAndSuit(lastPlay.card),
          );
          const meld = [lastPlay.card, ...matching];
          const openHand = this.createOpenHandWith(playerParams, meld);
          const closedHand = playerParams.closedHand.filter(
            (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
          );

          // Draw another tile
          const deadWall: Card[] = gameEngine.gameParams?.deadWall;
          const drawnTile = deadWall.shift();
          closedHand.push(drawnTile);
          const newPlayerParams = { openHand, closedHand };

          // Update params
          this.resetSkips(gameEngine);
          gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
          gameEngine.updateGameParams({ lastPlay: null, deadWall });
          gameEngine.claimTurn(executingPlayerId, ClaimReason.GANG);
        },
      },
      //----------------------------------#01F2DF
      //- Chi
      {
        name: "Chi",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          // Deal with conflicting Hu
          const huKing = this.canAnyoneElse("Hu", {
            executingPlayerId,
            gameEngine,
          });
          if (huKing) return false;

          const lastPlay = gameEngine.gameParams?.lastPlay;
          if (!lastPlay) return false;

          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const alreadySkipped = playerParams.skipped;
          if (alreadySkipped) return false;

          // Deal with conflicting Peng
          const pengKing = this.canAnyoneElse("Peng", {
            executingPlayerId,
            gameEngine,
          });
          if (pengKing) return false;

          // You can't chi after you've already drawn
          const hasFullHand = this.hasAFullHand(playerParams);
          if (hasFullHand) return false;

          // Was last play was by the previous player
          const lastPlayerParams = gameEngine.getPlayerParams(lastPlay?.by);
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
              const lastPlay = gameEngine.gameParams?.lastPlay;
              const playerParams = gameEngine.getPlayerParams(
                executingPlayerId,
              );

              // Remove the tile from playedTiles of other player
              this.removeLastPlayedTile({ executingPlayerId, gameEngine });

              // Put the tile and your matching tiles in openHand
              const meld = [lastPlay.card, ...playerParams.closedHand].filter(
                this.matchStaircaseStartingAt(startTile),
              );
              const openHand = this.createOpenHandWith(playerParams, meld);
              const closedHand = playerParams.closedHand.filter(
                (t: Card) => meld.findIndex((m) => m.id === t.id) === -1,
              );
              const newPlayerParams = { openHand, closedHand };

              // Update params
              this.resetSkips(gameEngine);
              gameEngine.updatePlayer(executingPlayerId, newPlayerParams);
              gameEngine.updateGameParams({ lastPlay: null });
              gameEngine.claimTurn(executingPlayerId, ClaimReason.CHI);
            },
          }));
          if (availableMelds.length === 0) return false;
          return availableMelds;
        },
        onExecute: () => {},
      },
      //----------------------------------#01F2DF
      //- Hu
      {
        name: "Hu",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const hasFullHand = this.hasAFullHand(playerParams);
          const lastPlay = gameEngine.gameParams?.lastPlay;
          const alreadySkipped = playerParams.skipped;
          if (alreadySkipped) return false;

          let hand: Tile[] = [];

          // If your closed hand is full, check your closed
          // hand is winnable
          if (hasFullHand) hand = playerParams.closedHand;
          // Otherwise, try adding the last played tile to your
          // hand and see if that makes it a winning thing
          else if (!!lastPlay)
            hand = [lastPlay.card, ...playerParams.closedHand];

          if (hand.length === 0) return false;

          const openHand: Tile[] = oVal(playerParams?.openHand || {});
          const tileMatrix = new TileMatrix(
            hand,
            openHand,
            this.additionalWinConditions,
          );
          return tileMatrix.isWinnable;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const hasFullHand = this.hasAFullHand(playerParams);
          const lastPlay = gameEngine.gameParams?.lastPlay;

          let hand;
          if (hasFullHand) hand = playerParams.closedHand;
          else hand = [lastPlay.card, ...playerParams.closedHand];
          const newParams = { closedHand: hand };

          this.resetSkips(gameEngine);
          this.endGame(gameEngine, executingPlayerId, newParams);
        },
      },
      //----------------------------------#01F2DF
      //- Skip
      {
        name: "Skip",
        isAvailable: ({ executingPlayerId, gameEngine }) => {
          const playerParams = gameEngine.getPlayerParams(executingPlayerId);
          const isMyTurn = gameEngine.isPlayersTurn(executingPlayerId);
          const alreadySkipped = playerParams.skipped;
          const actions = this.getAvailableActions({
            executingPlayerId,
            gameEngine,
          });
          const hasAvailableActions = actions.length > 0;

          if (alreadySkipped || !hasAvailableActions || isMyTurn) return false;
          return true;
        },
        onExecute: ({ executingPlayerId, gameEngine }) => {
          gameEngine.updatePlayer(executingPlayerId, { skipped: true });
        },
      },
    ],
  };

  FULL_HAND_SIZE = 14;

  constructor(props: any, id?: string) {
    super(props, id || "mhjng-dianxin");
  }

  //* Helper Getters
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
}

export default DianXin;
