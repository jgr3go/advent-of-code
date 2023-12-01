import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

interface Coords {
  x: number;
  y: number;
}

const transform = (rows: AOCInput) => {
  return rows
    .map((row) => row.split(' '))
    .map((x) => <[string, number]>[x[0], parseInt(x[1])]);
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  let visited: { [node: string]: boolean } = {};
  let head: Coords = { x: 0, y: 0 };
  let tail: Coords = { x: 0, y: 0 };

  for (let move of data) {
    for (let ii = 0; ii < move[1]; ii++) {
      moveHead(head, move[0], 1);
      moveTail(head, tail);
      visit(visited, tail);
    }
  }
  return Object.keys(visited).length;
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);
  let visited: { [node: string]: boolean } = {};
  let knots: Coords[] = [];
  for (let ii = 0; ii < 10; ii++) {
    knots.push({ x: 0, y: 0 });
  }
  for (let move of data) {
    for (let ii = 0; ii < move[1]; ii++) {
      moveHead(knots[0], move[0], 1);
      for (let kidx = 1; kidx < knots.length; kidx++) {
        moveTail(knots[kidx - 1], knots[kidx]);
      }
      visit(visited, knots[knots.length - 1]);
    }
  }
  return Object.keys(visited).length;
};

function moveHead(head: Coords, dir: string, count: number) {
  if (dir == 'R') {
    head.x += count;
  } else if (dir == 'L') {
    head.x -= count;
  } else if (dir == 'U') {
    head.y += count;
  } else if (dir == 'D') {
    head.y -= count;
  }
}

function moveTail(head: Coords, tail: Coords) {
  let xDiff = head.x - tail.x;
  let yDiff = head.y - tail.y;

  if (Math.abs(xDiff) >= 2 || Math.abs(yDiff) >= 2) {
    if (xDiff) tail.x += xDiff < 0 ? -1 : 1;
    if (yDiff) tail.y += yDiff < 0 ? -1 : 1;
  }
}

function visit(visited: { [node: string]: boolean }, tail: Coords) {
  visited[`${tail.x}-${tail.y}`] = true;
}
