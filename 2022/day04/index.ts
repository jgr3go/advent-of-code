import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  return rows.map((row) =>
    row.split(',').map((nums) => nums.split('-').map((num) => parseInt(num)))
  );
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);

  return data.reduce((cnt, pair) => {
    let overlaps =
      (pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][1]) ||
      (pair[1][0] <= pair[0][0] && pair[1][1] >= pair[0][1]);

    return cnt + (overlaps ? 1 : 0);
  }, 0);
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);

  // much pretty. such fasties.
  return data.reduce((cnt, pair) => {
    let overlaps =
      (pair[0][0] <= pair[1][0] && pair[0][1] >= pair[1][0]) ||
      (pair[0][0] <= pair[1][1] && pair[0][1] >= pair[1][1]) ||
      (pair[1][0] <= pair[0][0] && pair[1][1] >= pair[0][0]) ||
      (pair[1][0] <= pair[0][1] && pair[1][1] >= pair[0][1]);
    return cnt + (overlaps ? 1 : 0);
  }, 0);
};
