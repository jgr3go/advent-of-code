import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform1 = (rows: AOCInput) => {
  return rows.map((x) =>
    x.split(' ').map((val) => (map[val] ? map[val] : val))
  );
};
const transform2 = (rows: AOCInput) => {
  return rows.map((x) => x.split(' '));
};

const points = {
  A: 1,
  B: 2,
  C: 3,
};
const map = {
  X: 'A',
  Y: 'B',
  Z: 'C',
};
const winlose = ['A', 'B', 'C', 'A'];

export const part1 = (rows: AOCInput) => {
  let data = transform1(rows);
  return data.reduce((sum, pair) => {
    let round =
      pair[0] == pair[1]
        ? 3
        : pair[0] == 'A' && pair[1] == 'B'
        ? 6
        : pair[0] == 'B' && pair[1] == 'C'
        ? 6
        : pair[0] == 'C' && pair[1] == 'A'
        ? 6
        : 0;

    return sum + round + points[pair[1]];
  }, 0);
};

export const part2 = (rows: AOCInput) => {
  let data = transform2(rows);
  return data.reduce((sum, pair) => {
    if (pair[1] == 'X')
      return sum + 0 + points[winlose[winlose.lastIndexOf(pair[0]) - 1]];
    else if (pair[1] == 'Y') return sum + 3 + points[pair[0]];
    else return sum + 6 + points[winlose[winlose.indexOf(pair[0]) + 1]];
  }, 0);
};
