import DianXinClass from "./mhjng/DianXin";

const allPaks: any = {};

const DianXin = new DianXinClass({});

allPaks[DianXin.id] = DianXin;

export default allPaks;
