# 🛠 Architecture of Majiang

This documents describes the high-level architecture of _Majiang_ (and a little on the cardpak + Wukong engine), including codebase structure and abstractions. If you are looking to familiarize yourself with the codebase, you're in the right place!

_This file is a work in progress._

## 🦉 Bird's Eye View

At the highest level, _Majiang_ stores the continuous state of a game in Firebase Realtime database. Games use a room structure, where rooms have an identifying id and all players who are hooked into a game are part of the same room.

We use the Firebase Realtime database to network game state among all players.

## 🗺 Code Map

This section briefly outline various important directories.

| File or Directory                  | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| [/src/engine](/src/engine)         | The WuKong GameEngine source code.                 |
| [/src/pak](/src/pak)               | Card "paks" defined here, aka tile sets and rules. |
| [/src/components](/src/components) | React frontend components.                         |
| [/src/pages](/src/pages)           | React pages of the game.                           |
| [/public](/public)                 | Source images, fonts, etc.                         |

## 💽 Data Structures

This section briefly talks about the various data structures and abstractions made.

### Rooms

...

When you join a room, your user data for that roomId gets saved to local storage (under the key `allUsersToRooms`). If you navigate back to the game's page (via game code), it'll then smartly rejoin you as the user saved in your user data.
