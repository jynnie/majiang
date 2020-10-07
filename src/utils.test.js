import expect from "expect.js";

import { sum, shuffle, oVal, oKey } from "./utils";

describe("sum", () => {
  it("sums numbers in an array", () => {
    expect(sum([1, 2])).to.be(3);
  });
});

describe("shuffle", () => {
  it("shuffles an array in place", () => {
    const testArray = [1, 2, 3];
    const shuffledArray = shuffle(testArray);

    expect(testArray).to.eql(shuffledArray);
  });
  it("keeps the same values of the original array", () => {
    const testArray = [1, 2, 3, 3];
    const shuffledArray = shuffle([...testArray]);

    expect(testArray).to.eql(shuffledArray.sort());
  });
});

describe("oVal", () => {
  it("gets the object values", () => {
    const actual = oVal({ a: 1, b: 2, c: 2 });
    const expected = [1, 2, 2];
    expect(actual.sort()).to.eql(expected.sort());
  });
});

describe("oKey", () => {
  it("gets the object keys", () => {
    const actual = oKey({ a: 1, b: 2, 1: 2 });
    const expected = ["a", "b", 1];
    expect(actual.sort()).to.eql(expected.sort());
  });
});
