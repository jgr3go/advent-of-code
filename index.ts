import * as path from "path";
import * as fs from "fs";
import { AOCFunc } from "./interfaces";

const runLatest = () => {
  let args = getArgs();
  let result = args.func(args.rows);
  console.log(args.part, result);
};

const getArgs = () => {
  let filepath = getLatest();
  let part12: string = "part2";
  let sample = false;

  let func: AOCFunc;

  let arg1 = process.argv[2] || "",
    arg2 = process.argv[3] || "",
    arg3 = process.argv[4] || "";

  if (arg1.includes("day")) filepath = path.join(__dirname, arg1);
  if (arg2.includes("day")) filepath = path.join(__dirname, arg2);
  if (arg3.includes("day")) filepath = path.join(__dirname, arg3);

  if (arg1 == "part1" || arg1 == "part2") part12 = arg1;
  if (arg2 == "part1" || arg2 == "part2") part12 = arg2;
  if (arg3 == "part1" || arg3 == "part2") part12 = arg3;

  if (arg1 == "sample" || arg2 == "sample" || arg3 == "sample") sample = true;

  let funcs = require(filepath);
  if (funcs[part12]) {
    func = funcs[part12];
  } else if (funcs.part2) {
    func = funcs.part2;
    part12 = "part2";
  } else {
    func = funcs.part1;
    part12 = "part1";
  }

  let rows = fs
    .readFileSync(path.join(filepath, sample ? "sample.txt" : "data.txt"))
    .toString()
    .split("\n");

  return { func, part: part12, rows };
};

export const getLatestYear = () => {
  let years = fs.readdirSync(__dirname);
  let latestYear = years
    .filter((d) => d.match(/^[0-9]/))
    .sort()
    .pop();
  return latestYear;
};

export const getLatestDay = () => {
  let latestYear = getLatestYear();
  let days = fs.readdirSync(path.join(__dirname, latestYear));
  let latestDay = days
    .filter((d) => d.startsWith("day"))
    .sort()
    .pop();
  return latestDay;
};

export const getLatest = () => {
  return path.join(__dirname, getLatestYear(), getLatestDay());
};

runLatest();
