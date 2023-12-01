import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  let matrixX = rows.map((row) => row.split('').map((val) => parseInt(val)));
  let matrixY: number[][] = [];

  // inverse X, easier calcs
  for (let ii = 0; ii < matrixX.length; ii++) {
    let row = [];
    for (let jj = 0; jj < matrixX[0].length; jj++) {
      row.push(matrixX[jj][ii]);
    }
    matrixY.push(row);
  }

  return { matrixX, matrixY };
};

export const part1 = (rows: AOCInput) => {
  let { matrixX, matrixY } = transform(rows);

  let count = matrixX.reduce((xcount, matrixXRow, xIdx) => {
    return (
      xcount +
      matrixXRow.reduce((ycount, height, yIdx) => {
        return ycount + (visible(matrixX, matrixY, xIdx, yIdx, height) ? 1 : 0);
      }, 0)
    );
  }, 0);

  return count;
};

export const part2 = (rows: AOCInput) => {
  let { matrixX, matrixY } = transform(rows);

  let max = 0;
  for (let ii = 0; ii < matrixX.length; ii++) {
    for (let jj = 0; jj < matrixY.length; jj++) {
      let score = scenicScore(matrixX, matrixY, ii, jj, matrixX[ii][jj]);
      if (score > max) max = score;
    }
  }
  return max;
};

function visible(
  matrixX: number[][],
  matrixY: number[][],
  xIdx: number,
  yIdx: number,
  height: number
) {
  if (
    xIdx == 0 ||
    yIdx == 0 ||
    xIdx == matrixX.length - 1 ||
    yIdx == matrixY.length - 1
  )
    return true;

  let left = matrixX[xIdx].slice(0, yIdx);
  let right = matrixX[xIdx].slice(yIdx + 1);
  let up = matrixY[yIdx].slice(0, xIdx);
  let down = matrixY[yIdx].slice(xIdx + 1);

  return (
    left.every((tree) => tree < height) ||
    right.every((tree) => tree < height) ||
    up.every((tree) => tree < height) ||
    down.every((tree) => tree < height)
  );
}

function scenicScore(
  matrixX: number[][],
  matrixY: number[][],
  xIdx: number,
  yIdx: number,
  height: number
) {
  if (
    xIdx == 0 ||
    yIdx == 0 ||
    xIdx == matrixX.length - 1 ||
    yIdx == matrixY.length - 1
  )
    return 0;

  // reverse it to start at closest tree
  let leftReversed = matrixX[xIdx].slice(0, yIdx).reverse();
  let right = matrixX[xIdx].slice(yIdx + 1);
  let upReversed = matrixY[yIdx].slice(0, xIdx).reverse();
  let down = matrixY[yIdx].slice(xIdx + 1);

  let score = (arr: number[], height: number) => {
    let curHeight = 0;
    let trees = 0;
    for (let ii = 0; ii < arr.length; ii++) {
      if (arr[ii] < height) {
        trees += 1;
        curHeight = arr[ii];
      } else {
        // this tree still counts
        trees += 1;
        break;
      }
    }
    return trees;
  };

  let leftScore = score(leftReversed, height),
    rightScore = score(right, height),
    upScore = score(upReversed, height),
    downScore = score(down, height);

  return leftScore * rightScore * upScore * downScore;
}
