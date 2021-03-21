import DianXinClass from "./mjng/DianXin";
import BaseSet from "./mjng/BaseSet";

const allPaks: { [id: string]: BaseSet } = {};

const DianXin = new DianXinClass({});

allPaks[DianXin.id] = DianXin;

export default allPaks;
