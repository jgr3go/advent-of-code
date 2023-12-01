import * as fs from "fs";
import * as path from "path";
import { getLatest, getLatestDay, getLatestYear } from ".";

const createFiles = () => {
  let latest = getNextDay();
  let newDir = "day" + (latest < 10 ? "0" + latest : latest);
  let dirpath = path.join(__dirname, getLatestYear(), newDir);

  fs.mkdirSync(dirpath);
  fs.writeFileSync(path.join(dirpath, "data.txt"), "");
  fs.writeFileSync(path.join(dirpath, "sample.txt"), "");
  fs.writeFileSync(
    path.join(dirpath, "index.ts"),
    `
import { AOCInput } from "../../interfaces";
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  return rows;
}

export const part1 = (rows: AOCInput) => {
  
}`
  );
};

const getNextDay = () => {
  let day = getLatestDay();
  let daynum = parseInt(day?.match(/day(\d+)/)[1] || "0");
  return daynum + 1;
};

createFiles();
