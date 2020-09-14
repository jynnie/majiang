import DianXinClass from "./mjng/DianXin/DianXin";
import CardPak from "../engine/CardPak";

const allPaks: { [id: string]: CardPak } = {};

const DianXin = new DianXinClass({});

allPaks[DianXin.id] = DianXin;

export default allPaks;
