/**
 * GameEngine card.pak v1
 *
 * Mostly just built to play diff. version of majiang
 */

import Paks from "../paks/Paks";
import { Action, Card } from "./CardPakTypes";

import { shuffle } from "../utils";

import firebase from "firebase";

export enum Stages {
  noRoom = "NO_ROOM",
  inLobby = "IN_LOBBY",
  inGame = "IN_GAME",
  gameEnd = "GAME_END",
}

//----------------------------------#01F2DF
export class GameEngine {
  userId?: string = undefined;
  username?: string = undefined;

  pakId: string = "mhjng-dianxin";
  roomId: string | null = null;
  hostPlayerId: string | null = null;
  cards?: Card[];
  gameParams: any = null;
  playerParams: any = null;
  gameEnded: boolean | null = null;
  players: { id: string }[] = [];

  localUpdater: ((val: any) => void) | null = null;
  db?: firebase.firestore.Firestore = undefined;
  roomRef?: firebase.firestore.DocumentReference = undefined;

  constructor(props?: any) {
    console.log(".•˚•.Booting GameEngine˚•.•˚");
  }

  attachReact = (setUpdate: (val: any) => void) => {
    this.localUpdater = setUpdate;
  };

  attachFirebase = (db: firebase.firestore.Firestore) => {
    this.db = db;
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

  get randomId() {
    const firstPartNum = (Math.random() * 46656) | 0;
    const secondPartNum = (Math.random() * 46656) | 0;
    const firstPart = ("00" + firstPartNum.toString(36)).slice(-2);
    const secondPart = ("00" + secondPartNum.toString(36)).slice(-2);
    return firstPart + secondPart;
  }

  set user(user: any) {
    this.userId = user.uid;
    this.username = user.displayName;
  }

  //----------------------------------#01F2DF
  //-- No Room --//

  createRoom = (roomId?: string) => {
    if (!this.userId) return;

    this.roomId = roomId || this.randomId;
    this.roomRef = this.db?.collection("rooms").doc(this.roomId);

    this.roomRef?.set({
      pakId: this.pakId,
      hostPlayerId: this.userId,
      gameEnded: null,
    });

    this.joinRoom(this.roomId);
  };

  joinRoom = (roomId?: string) => {
    if (!this.userId) return;
    if (!this.roomRef && !roomId) return;

    if (!this.roomRef && roomId) {
      this.roomRef = this.db?.collection("rooms").doc(roomId);
      this.roomId = roomId;
    }

    this.roomRef?.get().then((doc) => {
      if (!doc.exists && roomId) {
        this.createRoom(roomId);
      } else if (doc.exists) {
        this.roomRef
          ?.collection("players")
          .doc(this.userId)
          .set({
            id: this.userId,
            name: this.username,
          })
          .then(() => {
            this.updateReact();
          });
      }
    });

    // FIXME: set players to the collection snapshot
    this.players.push({ id: this.userId });
  };

  // For artificially adding players to the room
  addPlayerToRoom = ({ id, name }: { id: string; name: string }) => {
    if (!this.roomRef) return;

    this.roomRef?.collection("players").doc(id).set({
      id,
      name,
    });
    this.players.push({ id });
  };

  //----------------------------------#01F2DF
  //-- In Lobby --//

  startGame = async (cardPakId: string) => {
    this.gameEnded = false;

    // FIXME: Artificially, adding in players
    this.addPlayerToRoom({ id: "a", name: "player a" });
    this.addPlayerToRoom({ id: "b", name: "player b" });
    this.addPlayerToRoom({ id: "c", name: "player c" });

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

  //----------------------------------#01F2DF
  //-- In Game --//

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

  endGame = () => {
    this.gameEnded = true;
    this.updateReact();
  };

  //----------------------------------#01F2DF
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

  //----------------------------------#01F2DF
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
