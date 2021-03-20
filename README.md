# Majiang「麻将」

A web-based platform for variations of Majiang (also written Mahjong); built on top of the _card.pak_ engine.

This current iteration gives all clients access to other players information. Thus this is not meant for competitive play. To make this competitive, simply move the functions requiring more than your own information into a server.

Progress being recorded in [devlog](https://jynnie.me/devlog/wukong/).

## 🔨 Development

```sh
$ yarn install
```

```sh
$ yarn start
```

To deploy to [majiang.web.app](https://majiang.web.app/).

```sh
$ firebase deploy
```

## 🎒 Custom Rules

> This section is still in progress!

## 💪🏼 Motivation

Majiang.pak was built to support many variations of the rules of Mahjong. Aside from Riichi Mahjong, variations like Honkong and Sichuan Mahjong are difficult if not impossible to find online and for free. This platform was built for people to play those games with their friends and even write/contribute their own variations.

## 🎠 card.pak engine

The game runs on a web-based, modular card game engine dubbed 「card.pak」. The engine was designed to help facilitate and make card games for the web, without having to deal with writing custom frontend, etc. However, while Mahjong runs on this engine, a custom frontend has been outfitted for this engine. It is not compatible with non-majiang paks.

🀄
