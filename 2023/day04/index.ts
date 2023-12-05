import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

interface Card {
  card: number;
  winning: { [num: number]: boolean };
  have: { [num: number]: boolean };
  points: number;
  copies: number;
}

const transform = (rows: AOCInput) => {
  return rows.map((row) => {
    let [title, numbers] = row.split(':');
    let card = parseInt(title.match(/Card\s+([0-9]+)/)[1]);
    let [winning, have] = numbers.split('|');
    return <Card>{
      card,
      winning: winning
        .split(' ')
        .map((val) => parseInt(val))
        .filter((val) => !isNaN(val))
        .reduce((obj, val) => {
          obj[val] = true;
          return obj;
        }, {}),
      have: have
        .split(' ')
        .map((val) => parseInt(val))
        .filter((val) => !isNaN(val))
        .reduce((obj, val) => {
          obj[val] = true;
          return obj;
        }, {}),
      points: 0,
      copies: 1,
    };
  });
};

export const part1 = (rows: AOCInput) => {
  let data = transform(rows);

  return data.reduce((sum, card) => {
    for (let have of Object.keys(card.have)) {
      if (card.winning[have]) {
        if (card.points == 0) card.points = 1;
        else card.points *= 2;
      }
    }
    return sum + card.points;
  }, 0);
};

export const part2 = (rows: AOCInput) => {
  let data = transform(rows);

  for (let [idx, card] of data.entries()) {
    for (let have of Object.keys(card.have)) {
      if (card.winning[have]) card.points += 1;
    }
    for (let ii = 1; ii <= card.points; ii++) {
      data[idx + ii].copies += card.copies;
    }
  }

  return data.reduce((sum, card) => sum + card.copies, 0);
};
