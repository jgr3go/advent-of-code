import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  let elves = [[]];
  for (let row of rows) {
    if (row == "") {
      elves.push([]); 
      continue;
    }
    let cals = parseInt(row);
    elves[elves.length-1].push(cals);
  }
  return elves;
}

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  let elfNum = 1;
  let elfTotal = 0;

  data.forEach((elf, idx) => {
    let curTotal = _.sum(elf);
    if (curTotal > elfTotal) {
      elfNum = idx + 1;
      elfTotal = curTotal;
    }
  });
  return elfTotal;
}

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);

  let elfTotals = data.map(elf => _.sum(elf));
  let sorted = _.orderBy(elfTotals, x => x, "desc");
  return sorted[0] + sorted[1] + sorted[2];
}