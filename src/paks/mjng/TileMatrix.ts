/**
 * DianXin 点心 -- TileMatrix
 *
 * TileMatrix handles a lot of the logic of
 * determining whether a hand has proper melds.
 */

import { oKey, oVal, sum } from "utils";

import { Tile } from "./Tiles.model";

interface HandMatrix {
  [suit: string]: { [key: string]: number };
}

type TotalsArray = {
  suit: string;
  total: number;
  t2m3: boolean;
  tm3: boolean;
}[];

export type ConditionFunction = (
  closedHandMatrix?: HandMatrix,
  openHandMatrix?: HandMatrix,
) => boolean;

const HONORS_SUITS = ["feng", "long"];
const NUMBERED_SUITS = ["tong", "tiao", "wan"];

//----------------------------------#01F2DF
export class TileMatrix {
  closedHandMatrix: HandMatrix = {
    tiao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    tong: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    wan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    feng: { east: 0, south: 0, west: 0, north: 0 },
    long: { facai: 0, hongzhong: 0, baiban: 0 },
  };
  openHandMatrix: HandMatrix = {
    tiao: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    tong: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    wan: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
    feng: { east: 0, south: 0, west: 0, north: 0 },
    long: { facai: 0, hongzhong: 0, baiban: 0 },
  };
  additionalConditions?: ConditionFunction[] = [];

  NUMBERED_SUITS = NUMBERED_SUITS;
  HONORS_SUITS = HONORS_SUITS;
  ALL_SUITS = [...this.NUMBERED_SUITS, ...this.HONORS_SUITS];

  constructor(
    closedHand?: Tile[],
    openHand?: Tile[],
    additionalConditions?: ConditionFunction[],
  ) {
    closedHand?.map((tile) => {
      if (tile?.defaultParams?.suit)
        this.closedHandMatrix[tile.defaultParams.suit][tile.value] += 1;
    });
    openHand?.map?.((tile) => {
      if (tile?.defaultParams?.suit)
        this.openHandMatrix[tile.defaultParams.suit][tile.value] += 1;
    });
    this.additionalConditions = additionalConditions;
  }

  //----------------------------------#01F2DF
  get isWinnable() {
    const suitWithPair = this.checkTotals();
    // console.log("👀", "Totals", suitWithPair);
    if (!suitWithPair) return false;

    const suitWithPairOkay = this.checkMeldsNPair(suitWithPair);
    // console.log("👀", "Melds with pair", suitWithPairOkay);
    if (!suitWithPairOkay) return false;

    const meldsOk = this.checkMelds(suitWithPair);
    // console.log("👀", "Melds", meldsOk);
    if (!meldsOk) return false;

    // Check additional conditions
    let passedAllAdditionalConditions = true;
    this.additionalConditions?.forEach((condition) => {
      const passes = condition(this.closedHandMatrix, this.openHandMatrix);
      if (!passes) {
        passedAllAdditionalConditions = false;
        return false;
      }
    });
    return passedAllAdditionalConditions;
  }

  checkTotals = () => {
    // Get totals for each suit and see if they match up
    const totals: TotalsArray = [];

    oKey(this.closedHandMatrix).forEach((suit) => {
      const suitTotal = sum(this.getClosedSuitVals(suit));
      totals.push({
        suit,
        total: suitTotal,
        t2m3: (suitTotal - 2) % 3 === 0,
        tm3: suitTotal % 3 === 0,
      });
    });
    // console.log("👀 Totals", totals);

    const onlyOneT2m3 = sum(totals.map((m) => m.t2m3)) === 1;
    const sumsToNumSuits =
      sum(totals.map((m) => m.tm3)) + Number(onlyOneT2m3) === 5;
    const suitWithPair = totals.find((s) => s.t2m3)?.suit;
    // console.log("👀 Suit with pair", suitWithPair, onlyOneT2m3, sumsToNumSuits);

    if (!onlyOneT2m3 || !sumsToNumSuits) return false;
    return suitWithPair;
  };

  checkMelds = (suitWithPair: string) => {
    // Check the other suits for validity
    let suitsOkay = true;
    this.NUMBERED_SUITS.filter((suit) => suit !== suitWithPair).forEach(
      (suit) => {
        const suitOk = this.checkMeldsInNumberedSuit(
          this.getClosedSuitVals(suit),
        );

        if (suitOk === false) {
          // console.log("👀", "Suit failed", suit);
          suitsOkay = false;
          return false;
        }
      },
    );
    return suitsOkay;
  };

  checkMeldsNPair = (suitWithPair: string) => {
    // console.log("👀", "Suit with pair is", suitWithPair);
    let suitMatrix = this.getClosedSuitVals(suitWithPair);

    const isPairInHonors = HONORS_SUITS.indexOf(suitWithPair) > -1;

    // Pair is in an honors suit
    if (isPairInHonors) {
      let howManyPairs = 0;
      let theRestAreMelds = true;
      suitMatrix.forEach((count) => {
        if (count === 2) howManyPairs++;
        else if (count === 1) theRestAreMelds = false;
      });
      if (howManyPairs !== 1 || !theRestAreMelds) return false;
    }

    // Pair is in a numbered suit
    else {
      let isSuitWithPairOk = false;
      const tilesWithMoreThanOne = suitMatrix.reduce(
        (acc: number[], count, i) => (count > 1 ? [...acc, i] : acc),
        [],
      );
      if (tilesWithMoreThanOne.length === 0) return false;

      // For all possible pairs, remove the pair and
      // check if the remaining tiles fit into melds
      tilesWithMoreThanOne.forEach((tile) => {
        let suitMatrixCopy = suitMatrix;
        suitMatrixCopy[tile] -= 2;

        // As long as one permutation of removing a
        // pair works, then this suit is okay.
        if (this.checkMeldsInNumberedSuit(suitMatrixCopy)) {
          isSuitWithPairOk = true;
          return true;
        }
      });
      // console.log("👀", "Suit with pair okay", suitWithPairOk);
      if (isSuitWithPairOk === false) return false;

      // Check that the honors also all fit into melds
      let isHonorsOk = true;
      HONORS_SUITS.forEach((suit) => {
        const thisSuitMatrix = this.getClosedSuitVals(suit);
        const isThisSuitOk = this.checkMeldsInHonorsSuit(thisSuitMatrix);
        if (!isThisSuitOk) {
          isHonorsOk = false;
          return false;
        }
      });
      // console.log("👀", "Is honors melds ok", isHonorsOk);
      if (!isHonorsOk) return false;
    }

    return true;
  };

  checkMeldsInHonorsSuit = (suitMatrix: number[]) => {
    const suitTileCount = sum(suitMatrix);

    if (suitTileCount > 0) {
      // Remove pengs
      suitMatrix = suitMatrix.map((tile) => tile % 3);
      return sum(suitMatrix) === 0;
    }
    return true;
  };

  checkMeldsInNumberedSuit = (suitMatrix: number[]) => {
    const suitTileCount = sum(suitMatrix);

    if (suitTileCount > 0) {
      // Remove pengs
      suitMatrix = suitMatrix.map((tile) => tile % 3);

      // Try staircases
      let staircaseMatrix = suitMatrix.map((_) => 0);
      let i = suitMatrix.findIndex((j) => j !== 0);
      for (let loops = 0; loops <= suitTileCount / 3; loops++) {
        if (suitMatrix[i] && suitMatrix[i + 1] && suitMatrix[i + 2]) {
          staircaseMatrix[i] = 1;
          suitMatrix[i] -= 1;
          suitMatrix[i + 1] -= 1;
          suitMatrix[i + 2] -= 1;
        }

        // If this can't start anything else, continue to
        // the next non-zero index
        if (suitMatrix[i] === 0) i = suitMatrix.findIndex((j) => j !== 0);
      }
      // console.log("👀", "staircase", staircaseMatrix);
      // console.log("👀", "suitMatrix", suitMatrix, sum(suitMatrix));

      // If after trying to put together melds, we have extra
      // then this suit doesn't turn into good melds
      return sum(suitMatrix) === 0;
    }
    return true;
  };

  //----------------------------------#01F2DF
  getClosedSuitVals = (suit: string) => oVal(this.closedHandMatrix[suit]);
}
