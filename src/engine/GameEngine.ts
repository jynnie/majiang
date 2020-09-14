/**
 * GameEngine card.pak v1
 *
 * Mostly just built to play diff. version of majiang
 */

import Paks from "../paks/Paks";
import { Action, Card } from "../paks/CardPakTypes";

import { shuffle } from "../utils";

export enum Stages {
  noRoom = "NO_ROOM",
  inLobby = "IN_LOBBY",
  inGame = "IN_GAME",
  gameEnd = "GAME_END",
}

export class GameEngine {
  userId: string | null = null;

  pakId: string = "mhjng-dianxin";
  roomId: string | null = null;
  hostPlayerId: string | null = null;
  cards?: Card[];
  gameParams: any = null;
  playerParams: any = null;
  gameEnded: boolean | null = null;
  players: { id: string }[] = [];

  localUpdater: ((val: any) => void) | null = null;

  constructor(props?: any) {
    console.log("...Booting GameEngine...");
  }

  attachReact = (setUpdate: (val: any) => void) => {
    this.localUpdater = setUpdate;
  };

  // FIXME: updateReact is called manually in DianXin when it shouldn't be
  updateReact = () => {
    this.localUpdater && this.localUpdater(Math.random());
  };

  get stage() {
    if (this.roomId === null) return Stages.noRoom;
    if (this.gameEnded === null) return Stages.inLobby;
    if (this.gameEnded === false) return Stages.inGame;
    if (this.gameEnded === true) return Stages.gameEnd;
    return Stages.noRoom;
  }

  set user(id: string) {
    this.userId = id;
  }

  //---------------------------------------#00D4B2
  //-- No Room --//

  createRoom = () => {
    if (!this.userId) return;

    this.roomId = "1";
    this.joinRoom();
    this.updateReact();
  };

  joinRoom = () => {
    if (!this.userId) return;

    this.players.push({ id: this.userId });
  };

  //---------------------------------------#00D4B2
  //-- In Lobby --//

  startGame = async (cardPakId: string) => {
    this.gameEnded = false;

    // FIXME: Artificially, adding in players
    this.players.push({ id: "player a" });
    this.players.push({ id: "player b" });
    this.players.push({ id: "player c" });

    await this.setupNewGame();
    this.updateReact();
  };

  setupNewGame = async () => {
    const pak = this.pak;
    if (!pak || !pak.rules) return;

    this.playerParams = await shuffle([...this.players]).map((player, i) => ({
      ...player,
      ...pak.rules?.playerParams,
      // FIXME: Actually check player seats
      seat: i,
    }));

    this.cards = pak.deck?.cards.map((card) => ({
      ...card,
      params: card.defaultParams,
    }));

    this.gameParams = pak.rules.gameParams;

    if (pak.rules.turnBased) this.gameParams.seatTurn = 0;

    pak.rules.onGameStart(this);
  };

  //---------------------------------------#00D4B2
  //-- In Game --//

  // endGame = () => {};

  finishTurn = () => {
    this.gameParams.seatTurn =
      (this.gameParams.seatTurn + 1) % this.players.length;
    this.updateReact();
  };

  claimTurn = (id: string) => {
    const player = this.getPlayerParams(id);
    this.gameParams.seatTurn = player.seat;
    this.updateReact();
  };

  //---------------------------------------#00D4B2
  //-- Helpful Getters for In Game --//

  getPlayer = (id: string) => {
    return this.players.find((player) => id === player.id);
  };

  getPlayerParams = (id: string) => {
    return this.playerParams.find((player: any) => id === player.id);
  };

  isPlayersTurn = (id: string) => {
    if (!this.rules?.turnBased) return true;

    const playerParams = this.getPlayerParams(id);
    return playerParams.seat === this.gameParams.seatTurn;
  };

  getAvailableActions = (id: string) => {
    const allActions = this.rules?.playerActions;
    const availableActions: Action[] = [];

    allActions?.forEach((action) => {
      const isAvailable = action.isAvailable({
        executingPlayerId: id,
        gameEngine: this,
      });
      if (Array.isArray(isAvailable)) {
        isAvailable.forEach((subaction) => availableActions.push(subaction));
      } else if (isAvailable) {
        availableActions.push(action);
      }
    });

    return availableActions;
  };

  get myParams() {
    return this.playerParams.find((player: any) => this.userId === player.id);
  }

  get lastPlayedCard() {
    return this.gameParams.lastPlay;
  }

  get pak() {
    return Paks[this.pakId];
  }

  get rules() {
    return this.pak?.rules;
  }

  //---------------------------------------#00D4B2
  //-- Helpers --//

  updateGameParams = (newParams: any) => {
    this.gameParams = { ...this.gameParams, ...newParams };
    console.log("📙 Updated Game Params", this.gameParams);
  };

  updatePlayer = (playerId: string, newParams: any) => {
    this.playerParams = this.playerParams.map((p: any) => {
      if (p.id === playerId) return { ...p, ...newParams };
      else return p;
    });
    console.log("📙 Updated Player", playerId);
  };
}

const ENG = new GameEngine();

export default ENG;
