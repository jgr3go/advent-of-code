import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';
import * as util from 'util';

interface Game {
  game: number;
  counts: Array<
    Array<{
      color: string;
      count: number;
    }>
  >;
}

const transform = (rows: AOCInput) => {
  return rows.map((row) => {
    let [title, setString] = row.split(':');
    let game = title.match(/Game ([0-9]+)/)[1];
    let sets = setString.split(';');
    let counts = sets.map((set) => {
      let colors = [...set.matchAll(/([0-9]+) ([a-z]+)/g)];
      return colors.map((color) => ({
        color: color[2],
        count: parseInt(color[1]),
      }));
    });

    return {
      game: parseInt(game),
      counts,
    };
  });
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);
  let rules = {
    red: 12,
    green: 13,
    blue: 14,
  };

  return data.reduce((sum, game) => {
    if (isValid(game, rules)) return sum + game.game;
    return sum;
  }, 0);
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);

  return data.reduce((sum, game) => sum + fewestPower(game), 0);
};

let isValid = (game: Game, rules: { [color: string]: number }) => {
  for (let counts of game.counts) {
    for (let color of counts) {
      if (color.count > rules[color.color]) return false;
    }
  }
  return true;
};

let fewestPower = (game: Game) => {
  let fewest: { [color: string]: number } = {};
  for (let counts of game.counts) {
    for (let color of counts) {
      if (!fewest[color.color]) fewest[color.color] = 0;
      fewest[color.color] = Math.max(fewest[color.color], color.count);
    }
  }
  return Object.entries(fewest).reduce((power, count) => {
    return power * count[1];
  }, 1);
};
