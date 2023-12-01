import { AOCInput } from "../../interfaces";
import * as _ from "lodash";

const transform = (rows: AOCInput) => {
  return rows;
};

export const part1 = (rows: AOCInput) => {
  let sum = rows.reduce((cur, row) => {
    let digits = row.match(/([0-9]{1})/g);
    let number = parseInt(_.first(digits) + _.last(digits));
    return cur + number;
  }, 0);
  return sum;
};

const map = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

export const part2 = (rows: AOCInput) => {
  let sum = rows.reduce((cur, row) => {
    let regexOr = Object.keys(map).join("|");
    // gonna be honest don't really understand positive lookaheads but here we go
    let regex = new RegExp(`(?=([0-9]{1}|${regexOr}))`, "g");
    let digits = [...row.matchAll(regex)]
      .map((match) => match[1])
      .map((digit) => (map[digit] ? map[digit] : digit));
    let number = parseInt(_.first(digits) + _.last(digits));
    return cur + number;
  }, 0);
  return sum;
};
