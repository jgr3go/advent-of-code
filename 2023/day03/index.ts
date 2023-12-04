import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

interface Cell {
  part: number;
  symbol: boolean;
  dot: boolean;
  valid: boolean;
  gear: boolean;
}

const transform = (rows: AOCInput) => {
  let allParts = [];
  let newGrid = rows.map((row) => {
    let numberMatch = row.matchAll(/([0-9]+)/gm);
    let newRow: Cell[] = row.split('').map((val) => ({
      part: null,
      symbol: !val.match(/[0-9]|\./),
      dot: val == '.',
      valid: false,
      gear: val == '*',
    }));

    for (let match of numberMatch) {
      let part: Cell = {
        part: parseInt(match[1]),
        valid: false,
        symbol: false,
        dot: false,
        gear: false,
      };
      allParts.push(part);

      for (let ii = 0; ii < match[1].length; ii++) {
        newRow[match.index + ii] = part;
      }
    }
    return newRow;
  });

  return {
    data: newGrid,
    allParts,
  };
};

export const part1 = (rows: AOCInput) => {
  let { data, allParts } = transform(rows);
  for (let xx = 0; xx < rows.length; xx++) {
    let col = data[xx];
    for (let yy = 0; yy < col.length; yy++) {
      let cell = col[yy];
      if (cell.symbol) {
        setValid(xx - 1, yy - 1, data);
        setValid(xx, yy - 1, data);
        setValid(xx + 1, yy - 1, data);
        setValid(xx - 1, yy, data);
        setValid(xx + 1, yy, data);
        setValid(xx - 1, yy + 1, data);
        setValid(xx, yy + 1, data);
        setValid(xx + 1, yy + 1, data);
      }
    }
  }

  return allParts.reduce(
    (sum, part) => (part.valid ? sum + part.part : sum),
    0
  );
};

export const part2 = (rows: AOCInput) => {
  let { data, allParts } = transform(rows);

  return data.reduce((rowSum, cols, xx) => {
    return (
      rowSum +
      cols.reduce((colSum, cell, yy) => {
        return colSum + getRatio(xx, yy, data);
      }, 0)
    );
  }, 0);
};

let setValid = (xx: number, yy: number, data: Cell[][]) => {
  if (data[xx]?.[yy] && data[xx]?.[yy]?.part) {
    data[xx][yy].valid = true;
  }
};

let getRatio = (xx: number, yy: number, data: Cell[][]) => {
  if (!data[xx][yy].gear) return 0;
  let distinctNeighbors = _.uniq(
    [
      data[xx - 1]?.[yy - 1],
      data[xx]?.[yy - 1],
      data[xx + 1]?.[yy - 1],
      data[xx - 1]?.[yy],
      data[xx + 1]?.[yy],
      data[xx - 1]?.[yy + 1],
      data[xx]?.[yy + 1],
      data[xx + 1]?.[yy + 1],
    ]
      .filter((cell) => !!cell)
      .filter((cell) => cell.part)
  );

  if (distinctNeighbors.length == 2) {
    return distinctNeighbors[0].part * distinctNeighbors[1].part;
  }
  return 0;
};
