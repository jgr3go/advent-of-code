import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  let packets = [];
  for (let ii = 0; ii < rows.length; ii++) {
    let packet1 = eval(rows[ii]);
    let packet2 = eval(rows[ii + 1]);
    packets.push({ left: packet1, right: packet2 });
    ii += 2;
  }
  return packets;
};

const transform2 = (rows: AOCInput) => {
  let packets = [];
  for (let ii = 0; ii < rows.length; ii++) {
    if (rows[ii].length) {
      packets.push(eval(rows[ii]));
    }
  }
  return packets;
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  let correct = [];
  for (let ii = 0; ii < data.length; ii++) {
    let isCorrect = compare(data[ii].left, data[ii].right);
    if (isCorrect) {
      correct.push(ii + 1);
    }
  }
  return correct.reduce((sum, cur) => sum + cur, 0);
};

export const part2 = (rows: AOCInput) => {
  let data = transform2(rows);
  let key1 = [[2]];
  let key2 = [[6]];
  data.push(key1, key2);

  let results = data.sort((left, right) => {
    let comp = compare(left, right);
    if (comp != null) return comp ? -1 : 1;
    return 0;
  });
  let idx1 = results.indexOf(key1) + 1;
  let idx2 = results.indexOf(key2) + 1;
  return idx1 * idx2;
};

let compare = (left: number[] | number, right: number[] | number) => {
  if (_.isNumber(left) && _.isNumber(right)) {
    if (left < right) return true;
    if (left > right) return false;
    return null;
  }
  if (_.isNumber(left) && _.isArray(right)) {
    let val = compare([left], right);
    if (val != null) return val;
  }
  if (_.isArray(left) && _.isNumber(right)) {
    let val = compare(left, [right]);
    if (val != null) return val;
  }
  if (_.isArray(left) && _.isArray(right)) {
    for (let ii = 0; ii < Math.max(left.length, right.length); ii++) {
      if (left[ii] != undefined && right[ii] != undefined) {
        let val = compare(left[ii], right[ii]);
        if (val != null) return val;
      } else {
        if (left.length < right.length) return true;
        if (left.length > right.length) return false;
        return null;
      }
    }
  }
  return null;
};
