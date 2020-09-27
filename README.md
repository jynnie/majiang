# Majiang「麻将」

A web-based platform for variations of Majiang (also written Mahjong); built on top of the _card.pak_ engine.

## 🐣 Progress

- [ ] DianXin rule set
  - [x] Hu execute
  - [ ] Deal with conflicting Peng vs Draw
  - [ ] Deal with conflicting Peng vs Chi
  - [ ] Deal with conflicting X vs Hu
- [ ] Front end beauty
- [x] Networking to Firebase
  - [ ] Should I be using Realtime > Firestore
- [ ] Dealing with conflicting calls
- [ ] Random room generation
- [ ] Design in between screens
- [ ] Points systems
- [ ] Handling disconnects; how easy would it be to move Engine to server

## 🎒 Custom Rules

> This section is still in progress!

## 🔨 Development

```sh
$ yarn install
```

```sh
$ yarn start
```

## 💪🏼 Motivation

Majiang.pak was built to support many variations of the rules of Mahjong. Aside from Riichi Mahjong, variations like Honkong and Sichuan Mahjong are difficult if not impossible to find online and for free. This platform was built for people to play those games with their friends and even write/contribute their own variations.

## 🎠 card.pak engine

The game runs on a web-based, modular card game engine dubbed 「card.pak」. The engine was designed to help facilitate and make card games for the web, without having to deal with writing custom frontend, etc. However, while Mahjong runs on this engine, a custom frontend has been outfitted for this engine. It is not compatible with non-majiang paks.

🀄
