/**
 * GameEngine card.pak v1
 *
 * Mostly just built to play diff. version of majiang
 */

import Paks from "../paks/Paks";
import { Action, Card } from "./CardPakTypes";

import { oVal, shuffle } from "../utils";

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
  _gameEnded: boolean | null = null;
  players: { id: string }[] = [];

  localUpdater: ((val: any) => void) | null = null;
  db?: firebase.database.Database = undefined;
  roomRef: (ref?: string) => firebase.database.Reference | undefined = () =>
    undefined;

  constructor(props?: any) {
    console.log(".•˚•.Booting GameEngine˚•.•˚");
  }

  attachReact = (setUpdate: (val: any) => void) => {
    this.localUpdater = setUpdate;
  };

  attachFirebase = (db: firebase.database.Database) => {
    this.db = db;
  };

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

  makeRoomRef = (roomId: string) => {
    return (ref?: string): firebase.database.Reference | undefined => {
      if (!ref) return this.db?.ref(`rooms/${roomId}`);
      return this.db?.ref(`rooms/${roomId}/${ref}`);
    };
  };

  createRoom = (roomId?: string) => {
    if (!this.userId) return;

    this.roomId = typeof roomId === "string" ? roomId : this.randomId;
    this.roomRef = this.makeRoomRef(this.roomId);

    this.roomRef()?.set({
      pakId: this.pakId,
      hostPlayerId: this.userId,
      gameEnded: null,
    });

    this.joinRoom(this.roomId);
  };

  joinRoom = async (roomId?: string) => {
    if (!this.userId) return;
    if (!this.roomRef && !roomId) return;

    if (!this.roomRef() && roomId) {
      this.roomId = roomId;
      this.roomRef = this.makeRoomRef(this.roomId);
    }

    await this.roomRef()
      ?.once("value")
      .then(async (doc) => {
        const docExists = !!doc.val();
        if (!docExists && roomId) this.createRoom(roomId);
        else if (docExists && this.userId && this.username) {
          await this.addPlayerToRoom({ id: this.userId, name: this.username });
          this.updateReact();
        }
      });

    this.subscribeToPlayerParams();
    this.subscribeToGameParams();
    this.subscribeToGameEnded();
    this.subscribeToPlayers();
  };

  addPlayerToRoom = async ({ id, name }: { id: string; name: string }) => {
    if (!this.roomRef) return;

    return this.roomRef(`players/${id}`)?.set({
      id,
      name,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  //----------------------------------#01F2DF
  //-- In Lobby --//

  startGame = async (cardPakId: string) => {
    this.gameEnded = false;

    await this.setupNewGame();
    this.updateReact();
  };

  setupNewGame = async () => {
    const pak = this.pak;
    if (!pak || !pak.rules) return;

    this.playerParams = await shuffle([...this.players]).map((player, i) => {
      const initialParams = {
        ...player,
        ...pak.rules?.playerParams,
        // FIXME: Actually check player seats
        seat: i,
      };
      this.updatePlayer(player.id, initialParams);
      // this.roomRef("playerParams/" + player.id)?.set(initialParams);
      return initialParams;
    });

    // TODO: Does this need to be networked?
    this.cards = pak.deck?.cards.map((card) => ({
      ...card,
      params: card.defaultParams,
    }));

    // Set initial gameParams
    this.updateGameParams(pak.rules.gameParams);

    if (pak.rules.turnBased) {
      this.updateGameParams({ seatTurn: 0 });
    }

    pak.rules.onGameStart(this);
  };

  //----------------------------------#01F2DF
  //-- Firebase Subscribers --//

  subscribeToPlayers = () => {
    const unsubscribe = this.roomRef("players")?.on("value", (doc) => {
      const data = doc.val();
      this.players = data ? oVal(data) : [];
      this.updateReact();
      console.log("👀 Received new players", this.players);
    });
    return unsubscribe;
  };

  subscribeToPlayerParams = () => {
    const unsubscribe = this.roomRef("playerParams")?.on("value", (doc) => {
      const data = doc.val();
      this.playerParams = data ? oVal(data) : [];
      this.updateReact();
      console.log("👀 Received new player params", this.playerParams);
    });
    return unsubscribe;
  };

  subscribeToGameParams = () => {
    const unsubscribe = this.roomRef("gameParams")?.on("value", (doc) => {
      this.gameParams = doc.val();
      this.updateReact();
      console.log("👀 Received new game params", this.gameParams);
    });
    return unsubscribe;
  };

  subscribeToGameEnded = () => {
    const unsubscribe = this.roomRef("gameEnded")?.on("value", (doc) => {
      this._gameEnded = doc.val();
      this.updateReact();
      console.log("👀 Received new game ended", this._gameEnded);
    });
    return unsubscribe;
  };

  get gameEnded() {
    return this._gameEnded;
  }

  set gameEnded(newEnd) {
    this.roomRef("gameEnded")?.set(newEnd);
  }

  //----------------------------------#01F2DF
  //-- In Game --//

  finishTurn = async () => {
    await this.updateGameParams({
      seatTurn: (this.gameParams.seatTurn + 1) % this.players.length,
    });
    this.updateReact();
  };

  claimTurn = (id: string) => {
    const player = this.getPlayerParams(id);
    this.updateGameParams({
      seatTurn: player.seat,
    });
    this.updateReact();
  };

  endGame = () => {
    this.gameEnded = true;
    this.updateReact();
  };

  leaveRoom = () => {
    // TODO: Remove player from room, etc
  };

  //----------------------------------#01F2DF
  //-- Helpful Getters for In Game --//

  getPlayer = (id: string) => {
    return this.players.find((player) => id === player.id);
  };

  getPlayerParams = (id?: string) => {
    if (!id) return this.pak.rules?.playerParams;
    const storedParams = this.playerParams.find(
      (player: any) => id === player.id,
    );
    return { ...this.pak.rules?.playerParams, ...storedParams };
  };

  isPlayersTurn = (id: string) => {
    if (!this.rules?.turnBased) return true;

    const playerParams = this.getPlayerParams(id);
    return playerParams.seat === this.gameParams?.seatTurn;
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
    return this.getPlayerParams(this.userId);
  }

  get mySeat() {
    return this.getPlayerParams(this.userId).seat;
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
    const update = this.roomRef("gameParams")?.update(newParams);
    console.log("📙 Updated Game Params", newParams);
    return update;
  };

  updatePlayer = (playerId: string, newParams: any) => {
    const update = this.roomRef("playerParams/" + playerId)?.update({
      ...newParams,
    });
    console.log("📙 Updated Player", playerId, newParams);
    return update;
  };
}
