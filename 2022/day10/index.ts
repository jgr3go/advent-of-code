import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  return rows
    .map((x) => x.split(' '))
    .map((x) => <[string, number]>[x[0], parseInt(x[1])]);
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  let cycle = 1,
    X = 1;
  let strength = 0;
  for (let inst of data) {
    if (inst[0] == 'noop') {
      cycle += 1;
      strength = evaluateStrength(strength, cycle, X);
    } else if (inst[0] == 'addx') {
      cycle += 1;
      strength = evaluateStrength(strength, cycle, X);
      cycle += 1;
      X += inst[1];
      strength = evaluateStrength(strength, cycle, X, inst[1]);
    }
  }
  return strength;
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);
  let cycle = 0,
    X = 1;
  // HOLY FUCKBALLS THIS GENERATES A SINGLE REFERENCED SUBARRAY
  // let array = new Array(6).fill(new Array(40));
  let array: string[][] = [];
  for (let ii = 0; ii < 6; ii++) {
    array.push(new Array(40).fill(''));
  }

  for (let inst of data) {
    if (inst[0] == 'noop') {
      cycle += 1;
      evaluateDraw(array, cycle, X);
    } else {
      cycle += 1;
      evaluateDraw(array, cycle, X);
      cycle += 1;
      evaluateDraw(array, cycle, X);
      X += inst[1];
    }
  }

  draw(array);
};

function evaluateStrength(
  strength: number,
  cycle: number,
  X: number,
  added?: number
) {
  if (cycle == 20 || (cycle - 20) % 40 == 0) {
    let signal = cycle * X;
    return strength + signal;
  }
  return strength;
}

function evaluateDraw(array: string[][], cycle: number, X: number) {
  let row = Math.floor((cycle - 1) / 40);
  let xmin = X - 1,
    xmax = X + 1;
  let rowPixel = cycle - 1 - row * 40;
  if (xmin <= rowPixel && rowPixel <= xmax) {
    array[row][rowPixel] = '#';
  } else {
    array[row][rowPixel] = '.';
  }
}

function draw(array: string[][]) {
  for (let row of array) {
    console.log(row.join(''));
  }
}
