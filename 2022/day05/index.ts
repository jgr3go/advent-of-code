import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

const transform = (rows: AOCInput) => {
  let isMoves = false;
  let stacks: { string?: Array<number> } = {};
  let moves = [];

  for (let row of rows) {
    if (!isMoves) {
      // moving to moves
      if (row == '') {
        isMoves = true;
        continue;
      }
      for (let idx = 0; idx < row.length; idx++) {
        // only columns we care about
        if ((idx - 1) % 4 == 0) {
          if (row[idx] == ' ' || !!parseInt(row[idx])) continue;
          else {
            let stackIndex = Math.floor(idx / 4) + 1;
            if (!stacks[stackIndex]) stacks[stackIndex] = [];
            stacks[stackIndex].unshift(row[idx]);
          }
        }
      }
    } else {
      let move = row.match(/move (\d+) from (\d+) to (\d+)/i);
      moves.push({ from: move[2], to: move[3], count: parseInt(move[1]) });
    }
  }

  return { stacks, moves };
};

export const part1 = (rows: AOCInput) => {
  let { stacks, moves } = transform(rows);
  for (let move of moves) {
    if (!stacks[move.from]) stacks[move.from] = [];
    if (!stacks[move.to]) stacks[move.to] = [];

    for (let ii = 0; ii < move.count; ii++) {
      let thing = stacks[move.from].pop();
      stacks[move.to].push(thing);
    }
  }

  let results = [];
  for (let stack of Object.values(stacks)) {
    results.push(stack[stack.length - 1]);
  }
  return results.join('');
};

export const part2 = (rows: AOCInput) => {
  let { stacks, moves } = transform(rows);
  for (let move of moves) {
    if (!stacks[move.from]) stacks[move.from] = [];
    if (!stacks[move.to]) stacks[move.to] = [];

    let temp = [];
    // kinda gross but same deal as before but unshift them into an array
    for (let ii = 0; ii < move.count; ii++) {
      let thing = stacks[move.from].pop();
      temp.unshift(thing);
    }
    // then reshift them back into the results -- simulates "in" order
    while (temp.length) {
      let thing = temp.shift();
      stacks[move.to].push(thing);
    }
  }

  let results = [];
  for (let stack of Object.values(stacks)) {
    results.push(stack[stack.length - 1]);
  }
  return results.join('');
};
