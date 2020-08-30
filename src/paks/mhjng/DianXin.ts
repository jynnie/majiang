/**
 * DianXin 点心
 *
 * This is the most basic version of Chinese mahjong,
 * based off of Cantonese rules.
 */

import CardPak from "../CardPak";

const TILES = [
  { name: "yibing", defaultParams: { suit: "tong" }, value: 1 },
  { name: "ertong", defaultParams: { suit: "tong" }, value: 2 },
  { name: "santong", defaultParams: { suit: "tong" }, value: 3 },
  { name: "sitong", defaultParams: { suit: "tong" }, value: 4 },
  { name: "wutong", defaultParams: { suit: "tong" }, value: 5 },
  { name: "liutong", defaultParams: { suit: "tong" }, value: 6 },
  { name: "qitong", defaultParams: { suit: "tong" }, value: 7 },
  { name: "batong", defaultParams: { suit: "tong" }, value: 8 },
  { name: "jiutong", defaultParams: { suit: "tong" }, value: 9 },

  { name: "yiwan", defaultParams: { suit: "wan" }, value: 1 },
  { name: "erwan", defaultParams: { suit: "wan" }, value: 2 },
  { name: "sanwan", defaultParams: { suit: "wan" }, value: 3 },
  { name: "siwan", defaultParams: { suit: "wan" }, value: 4 },
  { name: "wuwan", defaultParams: { suit: "wan" }, value: 5 },
  { name: "liuwan", defaultParams: { suit: "wan" }, value: 6 },
  { name: "qiwan", defaultParams: { suit: "wan" }, value: 7 },
  { name: "bawan", defaultParams: { suit: "wan" }, value: 8 },
  { name: "jiuwan", defaultParams: { suit: "wan" }, value: 9 },

  { name: "yaoji", defaultParams: { suit: "tiao" }, value: 1 },
  { name: "liangtiao", defaultParams: { suit: "tiao" }, value: 2 },
  { name: "santiao", defaultParams: { suit: "tiao" }, value: 3 },
  { name: "sitiao", defaultParams: { suit: "tiao" }, value: 4 },
  { name: "wutiao", defaultParams: { suit: "tiao" }, value: 5 },
  { name: "liutiao", defaultParams: { suit: "tiao" }, value: 6 },
  { name: "qitiao", defaultParams: { suit: "tiao" }, value: 7 },
  { name: "batiao", defaultParams: { suit: "tiao" }, value: 8 },
  { name: "jiutiao", defaultParams: { suit: "tiao" }, value: 9 },

  { name: "dong", defaultParams: { suit: "feng" }, value: "east" },
  { name: "nan", defaultParams: { suit: "feng" }, value: "south" },
  { name: "xi", defaultParams: { suit: "feng" }, value: "west" },
  { name: "bei", defaultParams: { suit: "feng" }, value: "north" },

  { name: "hongzhong", defaultParams: { suit: "long" }, value: "hongzhong" },
  { name: "facai", defaultParams: { suit: "long" }, value: "facai" },
  { name: "baiban", defaultParams: { suit: "long" }, value: "baiban" },
];

const makeTiles = () => {
  const fourOfEachTile = [...TILES, ...TILES, ...TILES, ...TILES];
  return fourOfEachTile.map((tile, i) => ({
    id: i,
    ...tile,
  }));
};

class DianXin extends CardPak {
  deck = {
    visualDeckId: "mhjng-traditional",
    cards: makeTiles(),
  };

  constructor(props: any) {
    super(props, "mhjng-dianxin");
  }

  setup = () => {};
}

export default DianXin;
