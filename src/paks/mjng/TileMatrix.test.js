import expect from "expect.js";

import { TILES } from "./DianXin";
import { TileMatrix } from "../TileMatrix";

//---------------------------------------#00D4B2
//- Test cases
const WINNING_BASIC_HAND = [
  "bawan",
  "bawan",
  "bawan",
  "yiwan",
  "erwan",
  "sanwan",
  "qitong",
  "qitong",
  "wuwan",
  "liuwan",
  "qiwan",
].map((t) => TILES.find((a) => a.name === t));

const WINNING_ONE_SUIT_HAND = [
  "siwan",
  "siwan",
  "yiwan",
  "erwan",
  "sanwan",
  "liuwan",
  "qiwan",
  "bawan",
].map((t) => TILES.find((a) => a.name === t));

const WINNING_LONG_PAIR_HAND = [
  "facai",
  "facai",
  "yiwan",
  "erwan",
  "sanwan",
  "liuwan",
  "qiwan",
  "bawan",
].map((t) => TILES.find((a) => a.name === t));

const FAILING_NO_PAIR_HAND = [
  "bawan",
  "bawan",
  "bawan",
  "qitong",
  "liutong",
  "wuwan",
  "liuwan",
  "qiwan",
].map((t) => TILES.find((a) => a.name === t));

const FAILING_NOT_A_MELD_HAND = [
  "bawan",
  "bawan",
  "jiutong",
  "qitong",
  "liutong",
  "wuwan",
  "liuwan",
  "qiwan",
].map((t) => TILES.find((a) => a.name === t));

//---------------------------------------#00D4B2
//- TileMatrix tests
describe("TileMatrix", () => {
  describe("initialization", () => {
    it("initializes a blank matrix if empty hand", () => {
      const tm = new TileMatrix([]);
      const blankHm = {
        tiao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
        tong: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
        wan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
        feng: { dong: 0, nan: 0, xi: 0, bei: 0 },
        long: { facai: 0, hongzhong: 0, baiban: 0 },
      };

      expect(tm.closedHandMatrix).to.eql(blankHm);
    });

    it("initializes from hand tiles", () => {
      const tm = new TileMatrix(WINNING_BASIC_HAND);
      const testHm = {
        tiao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
        tong: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 2, 8: 0, 9: 0 },
        wan: { 1: 1, 2: 1, 3: 1, 4: 0, 5: 1, 6: 1, 7: 1, 8: 3, 9: 0 },
        feng: { dong: 0, nan: 0, xi: 0, bei: 0 },
        long: { facai: 0, hongzhong: 0, baiban: 0 },
      };

      expect(tm.closedHandMatrix).to.eql(testHm);
    });
  });

  describe("isWinnable", () => {
    it("checks basic winning hands", () => {
      const tm = new TileMatrix(WINNING_BASIC_HAND);
      expect(tm.isWinnable).to.be(true);
    });

    it("checks winning one suit hands", () => {
      const tm = new TileMatrix(WINNING_ONE_SUIT_HAND);
      expect(tm.isWinnable).to.be(true);
    });

    it("checks winning hand with pair in honors", () => {
      const tm = new TileMatrix(WINNING_LONG_PAIR_HAND);
      expect(tm.isWinnable).to.be(true);
    });

    it("fails hand with no pair", () => {
      const tm = new TileMatrix(FAILING_NO_PAIR_HAND);
      expect(tm.isWinnable).to.be(false);
    });

    it("fails hand with broken meld", () => {
      const tm = new TileMatrix(FAILING_NOT_A_MELD_HAND);
      expect(tm.isWinnable).to.be(false);
    });
  });
});
