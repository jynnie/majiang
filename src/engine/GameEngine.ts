import firebase from "firebase";

import Paks from "../paks/Paks";
import { Action, Card } from "./CardPakTypes";
import { oKey, oVal, shuffle } from "../utils";

export enum Stages {
  noRoom = "NO_ROOM",
  inLobby = "IN_LOBBY",
  inGame = "IN_GAME",
  gameEnd = "GAME_END",
}

/**
 * Game Engine Wukong
 * card.pak engine v1
 *
 * Handles room management, writing to firebase,
 * updating React when firebase changes are read, and
 * handling ALL of game state.
 * Mostly built to play diff. versions of majiang.
 * @class
 */
export class GameEngine {
  // Current user information
  uid?: string = undefined;
  displayName?: string = undefined;
  // All your user data by games rooms you've joined
  // Helps for reconnecting
  allUsersToRooms: {
    [roomId: string]: { uid: string; displayName: string };
  } = {};

  // id of the cardpak being played
  pakId: string = "mhjng-dianxin";

  // id of the game room
  roomId?: string;

  // id of the host player
  hostPlayerId?: string;

  // A copy of all the cards in the pak
  cards?: Card[];

  // Parameters of the current game
  gameParams?: any;

  // Player parameters in current game
  playerParams?: any[];

  // Whether the current game has ended, used to determine
  // the current state of the game
  _gameEnded: boolean | null = null;

  // Array of all players in game
  players: { id: string }[] = [];

  // A setState function used to update the top level React page
  localUpdater?: (val: any) => void;

  // The Firebase Realtime database
  db?: firebase.database.Database;

  // A Firebase Reference to the room of roomId
  roomRef: (ref?: string) => firebase.database.Reference | undefined = () =>
    undefined;

  //* Constructor

  constructor() {
    console.log(".•˚•.Booting GameEngine˚•.•˚");

    const allUsersToRooms = window?.localStorage?.getItem("allUsersToRooms");
    if (allUsersToRooms) {
      try {
        this.allUsersToRooms = JSON.parse(allUsersToRooms) || {};
      } catch (e) {
        console.log(e);
      }
    }

    (window as any).GE = this;
  }

  attachReact = (setUpdate: (val: any) => void): void => {
    this.localUpdater = setUpdate;
  };

  attachFirebase = (db: firebase.database.Database): void => {
    this.db = db;
  };

  updateReact = (): void => {
    this.localUpdater && this.localUpdater(Math.random());
  };

  //* General room getters & setters

  get isHost() {
    return this.uid === this.hostPlayerId;
  }

  get stage() {
    if (this.roomId === undefined) return Stages.noRoom;
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
    this.uid = user.uid;
    this.displayName = user.displayName;
  }

  get user() {
    return { uid: this.uid, displayName: this.displayName };
  }

  //* Room Methods

  makeRoomRef = (roomId: string) => {
    return (ref?: string): firebase.database.Reference | undefined => {
      if (!ref) return this.db?.ref(`rooms/${roomId}`);
      return this.db?.ref(`rooms/${roomId}/${ref}`);
    };
  };

  private createNewGameUser = async (
    roomId: string,
    displayName: string,
    givenUid?: string,
  ) => {
    const uid = givenUid || this.randomId;

    this.user = { uid, displayName };
    this.allUsersToRooms[roomId] = this.user;
    await window.localStorage.setItem(
      "allUsersToRooms",
      JSON.stringify(this.allUsersToRooms),
    );
    return;
  };

  createRoom = (name: string, roomId?: string) => {
    this.roomId = typeof roomId === "string" ? roomId : this.randomId;
    this.roomRef = this.makeRoomRef(this.roomId);

    this.createNewGameUser(this.roomId, name);
    this.roomRef()?.set({
      pakId: this.pakId,
      hostPlayerId: this.uid,
      gameEnded: null,
    });

    return this.joinRoom(this.roomId);
  };

  joinRoom = async (roomId: string, name?: string) => {
    let userForRoom = this.allUsersToRooms[roomId];

    const isNoUserInfo = !this.uid && !name && !userForRoom;
    const isNoRoomInfo = !this.roomRef && !roomId;
    if (isNoUserInfo) return;
    if (isNoRoomInfo) return;

    const isNewRoomToJoin = !this.roomRef() && !!roomId;
    if (isNewRoomToJoin) {
      this.roomId = roomId;
      this.roomRef = this.makeRoomRef(this.roomId);
    }

    // Set user data based on whether we're creating a new user or not
    if (!userForRoom) {
      await this.createNewGameUser(roomId, name as string);
      userForRoom = this.allUsersToRooms[roomId];
    }

    await this.roomRef()
      ?.once("value")
      .then(async (doc) => {
        const docExists = !!doc.val();
        const userIdsInRoom = oKey(doc.val()?.players || {});

        const isNewRoom = !docExists && !!roomId && !!name;
        const isExistingRoom = docExists;
        const hasUserInfo = !!this.uid && !!this.displayName;
        const isReconnecting = userIdsInRoom.includes(userForRoom?.uid);

        if (isNewRoom) {
          this.createRoom(name as string, roomId);
        } else if (isExistingRoom && isReconnecting) {
          this.user = userForRoom;
          await this.reconnectPlayerToRoom(userForRoom.uid);
        } else if (isExistingRoom && hasUserInfo) {
          await this.addPlayerToRoom({
            id: this.uid as string,
            name: this.displayName as string,
          });
          this.updateReact();
        }
      });

    this.subscribeToSelf();
    this.subscribeToPlayerParams();
    this.subscribeToGameParams();
    this.subscribeToGameEnded();
    this.subscribeToGameHost();
    this.subscribeToPlayers();

    return roomId;
  };

  /**
   * Method run when a user tries to navigate to a room via uuid
   * in the url
   */
  tryRoom = async (roomId: string) => {
    const testRoomRef = this.makeRoomRef(roomId);
    let roomExists = false;

    // WORKAROUND: For some reason the await below the one here
    // doesn't seem to actually be awaiting when assigned to the
    // doc variable... But this one works?
    await testRoomRef()?.get();
    let doc = await testRoomRef()?.get();
    roomExists = !!doc?.exists();

    if (!roomExists) return false;

    return this.joinRoom(roomId);
  };

  private addPlayerToRoom = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    if (!this.roomRef) return;

    return this.roomRef(`players/${id}`)?.set({
      id,
      name,
      connected: true,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  };

  private reconnectPlayerToRoom = async (userId: string) => {
    if (!this.roomRef) return;
    return this.roomRef(`players/${userId}`)?.update({
      connected: true,
    });
  };

  leaveRoom = () => {
    // TODO: Remove player from room, etc
    // window?.localStorage?.removeItem("user");
  };

  //* Methods for in game/room lobby

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

  //* Firebase Subscribers

  subscribeToSelf = () => {
    if (!this.uid) return;
    const myRef = this.roomRef(`players/${this.uid}`);
    myRef?.onDisconnect().update({ connected: false });
    return myRef;
  };

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

  subscribeToGameHost = () => {
    const unsubscribe = this.roomRef("hostPlayerId")?.on("value", (doc) => {
      this.hostPlayerId = doc.val();
      this.updateReact();
      console.log("👀 Received new host player id", this.hostPlayerId);
    });
    return unsubscribe;
  };

  get gameEnded() {
    return this._gameEnded;
  }

  set gameEnded(newEnd) {
    this.roomRef("gameEnded")?.set(newEnd);
  }

  //* In Game Methods

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

  //* Helpful Getters for In Game

  getPlayer = (id: string) => {
    return this.players.find((player) => id === player.id);
  };

  getPlayerParams = (id?: string) => {
    if (!id) return this.pak.rules?.playerParams;
    const storedParams = this.playerParams?.find(
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
    return this.getPlayerParams(this.uid);
  }

  get mySeat() {
    return this.getPlayerParams(this.uid).seat;
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

  //* Firebase Updaters for In Game

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
