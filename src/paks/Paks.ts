import DianXinClass from "./mjng/DianXin";
import GuangDongClass from "./mjng/GuangDong";
import BaseSet from "./mjng/BaseSet";

const DianXin = new DianXinClass({});
const GuangDong = new GuangDongClass({});

const allPaks: { [id: string]: BaseSet } = {
  [DianXin.id]: DianXin,
  [GuangDong.id]: GuangDong,
};

export default allPaks;
