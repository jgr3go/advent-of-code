import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  return rows[0].split('');
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  // naive
  let arr = [];
  for (let ii = 0; ii < data.length; ii++) {
    if (arr.length >= 4) arr.shift();
    arr.push(data[ii]);
    if (arr.length == 4) {
      if (_.uniq(arr).length == 4) return ii + 1;
    }
  }
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);
  // naive
  let arr = [];
  for (let ii = 0; ii < data.length; ii++) {
    if (arr.length >= 14) arr.shift();
    arr.push(data[ii]);
    if (arr.length == 14) {
      if (_.uniq(arr).length == 14) return ii + 1;
    }
  }
};
