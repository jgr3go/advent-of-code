import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform1 = (rows: AOCInput) => {
  return rows.map((x) => [x.slice(0, x.length / 2), x.slice(x.length / 2)]);
};
const transform2 = (rows: AOCInput) => {
  return rows;
};

const CHARUPPER = 65;
const CHARLOWER = 97;
const GODDAMNFUCKINGCHARCODESAREREVERSED =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function mergeit(stringies: string[][]): number {
  let sum = stringies.reduce((cs, vals) => {
    // could be multiple intersections though the examples didn't say so
    return (
      cs +
      vals.reduce((cv, val: string) => {
        // ugh
        return cv + GODDAMNFUCKINGCHARCODESAREREVERSED.indexOf(val) + 1;
      }, 0)
    );
  }, 0);

  return sum;
}

export const part1 = (rows: AOCInput) => {
  let data = transform1(rows);
  let merged = [];
  for (let row of data) {
    merged.push(_.intersection(row[0].split(''), row[1].split('')));
  }

  return mergeit(merged);
};

export const part2 = (rows: AOCInput) => {
  let data = transform2(rows);

  let merged = [];
  for (let ii = 0; ii < data.length; ii += 3) {
    let elf1 = data[ii],
      elf2 = data[ii + 1],
      elf3 = data[ii + 2];
    let intersection = _.intersection(
      elf1.split(''),
      elf2.split(''),
      elf3.split('')
    );
    merged.push(intersection);
  }

  return mergeit(merged);
};
