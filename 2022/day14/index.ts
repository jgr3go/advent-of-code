import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';
import * as fs from 'fs';

const START = [500, 0];

interface WallCoord {
  x: number;
  y: number;
  rock: boolean;
  sand: boolean;
  empty: boolean;
  sandAtRest?: boolean;
}

const transform = (rows: AOCInput, includeFloor: boolean = false) => {
  let rocks = rows.map((row) =>
    row
      .split(' -> ')
      .map((xy) => xy.split(',').map((v) => parseInt(v)))
      .map((v) => ({ x: v[0], y: v[1] }))
  );

  let wall: WallCoord[][] = [];
  for (let x = 0; x <= 1000; x++) {
    let wallRow: WallCoord[] = [];
    for (let y = 0; y <= 1000; y++) {
      wallRow.push({ x, y, rock: false, sand: false, empty: true });
    }
    wall.push(wallRow);
  }

  for (let rockcorners of rocks) {
    for (let ii = 0; ii < rockcorners.length - 1; ii++) {
      let startRock = rockcorners[ii];
      let endRock = rockcorners[ii + 1];

      if (startRock.x == endRock.x) {
        let xx = startRock.x;
        let yyRange = _.orderBy([startRock.y, endRock.y]);
        for (let yy = yyRange[0]; yy <= yyRange[1]; yy++) {
          wall[xx][yy].rock = true;
          wall[xx][yy].empty = false;
        }
      } else {
        let yy = startRock.y;
        let xxRange = _.orderBy([startRock.x, endRock.x]);
        for (let xx = xxRange[0]; xx <= xxRange[1]; xx++) {
          wall[xx][yy].rock = true;
          wall[xx][yy].empty = false;
        }
      }
    }
  }

  let yyMax = rocks.reduce((maxr, row) => {
    return Math.max(
      maxr,
      row.reduce((max, cell) => {
        return Math.max(max, cell.y);
      }, 0)
    );
  }, 0);

  if (includeFloor) {
    for (let xx = 0; xx <= 1000; xx++) {
      wall[xx][yyMax + 2].rock = true;
      wall[xx][yyMax + 2].empty = false;
    }
  }
  print(wall);

  return wall;
};

export const part1 = (rows: AOCInput) => {
  let wall = transform(rows);
  let initialBounds = getBounds(wall);
  let yBottom = initialBounds.ymax;
  let full = false;
  while (!full) {
    let sand: WallCoord = {
      x: START[0],
      y: START[1],
      rock: false,
      sand: true,
      empty: false,
      sandAtRest: false,
    };

    while (!sand.sandAtRest) {
      if (sand.y > yBottom) {
        full = true;
        break;
      }

      if (wall[sand.x][sand.y + 1]?.empty) {
        sand.y += 1;
      } else if (wall[sand.x - 1]?.[sand.y + 1]?.empty) {
        sand.x -= 1;
        sand.y += 1;
      } else if (wall[sand.x + 1]?.[sand.y + 1]?.empty) {
        sand.x += 1;
        sand.y += 1;
      } else {
        wall[sand.x][sand.y] = sand;
        sand.sandAtRest = true;
      }
    }
  }
  print(wall);
  return count(wall);
};

export const part2 = (rows: AOCInput) => {
  let wall = transform(rows, true);
  let initialBounds = getBounds(wall);
  let yBottom = initialBounds.ymax;
  let full = false;
  while (!full) {
    let sand: WallCoord = {
      x: START[0],
      y: START[1],
      rock: false,
      sand: true,
      empty: false,
      sandAtRest: false,
    };

    while (!sand.sandAtRest) {
      if (sand.y > yBottom) {
        full = true;
        break;
      }

      if (wall[sand.x][sand.y + 1]?.empty) {
        sand.y += 1;
      } else if (wall[sand.x - 1]?.[sand.y + 1]?.empty) {
        sand.x -= 1;
        sand.y += 1;
      } else if (wall[sand.x + 1]?.[sand.y + 1]?.empty) {
        sand.x += 1;
        sand.y += 1;
      } else {
        wall[sand.x][sand.y] = sand;
        sand.sandAtRest = true;
        if (sand.x == START[0] && sand.y == START[1]) {
          full = true;
        }
      }
    }
  }

  return count(wall);
};

function count(wall: WallCoord[][]) {
  return wall.reduce((cnt, row) => {
    return (
      cnt +
      row.reduce((rcnt, cell) => {
        return rcnt + (cell.sand ? 1 : 0);
      }, 0)
    );
  }, 0);
}

function getBounds(wall: WallCoord[][]) {
  let xmin = 500,
    xmax = 500,
    ymin = 0,
    ymax = 0;
  for (let row of wall) {
    for (let cell of row) {
      if (!cell.empty) {
        xmin = Math.min(cell.x, xmin);
        xmax = Math.max(cell.x, xmax);
        ymin = Math.min(cell.y, ymin);
        ymax = Math.max(cell.y, ymax);
      }
    }
  }
  return { xmin, xmax, ymin, ymax };
}

function print(wall: WallCoord[][]) {
  let { xmin, xmax, ymin, ymax } = getBounds(wall);
  let logs = [];
  for (let yy = 0; yy <= ymax; yy++) {
    let log = [];
    for (let xx = xmin; xx <= xmax; xx++) {
      let tile = wall[xx][yy];
      log.push(
        tile.x == START[0] && tile.y === START[1]
          ? '+'
          : tile.rock
          ? '#'
          : tile.sand
          ? '.'
          : !tile.empty
          ? '█'
          : ' '
      );
    }
    logs.push(log);
  }
  console.log(logs.map((log) => log.join('')).join('\n'));
}
