import DianXin from "../DianXin";

/**
 * GuangDong 廣東
 *
 * This is the Cantonese version of Chinese majiang,
 * without flowers.
 * @class
 */
class GuangDong extends DianXin {
  constructor(props: any) {
    super(props, "mhjng-gaungdong");

    this.additionalWinConditions = [];
  }
}

export default GuangDong;
