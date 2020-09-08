import DianXinClass from "./mhjng/DianXin/DianXin";
import CardPak from "./CardPak";

const allPaks: { [id: string]: CardPak } = {};

const DianXin = new DianXinClass({});

allPaks[DianXin.id] = DianXin;

export default allPaks;
