import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

interface Monkey {
  monkey: number;
  starting: Array<number>;
  operation: string;
  operationvalue: string;
  test: number;
  trueTo: number;
  falseTo: number;
  inspections: number;
}
interface BigMonkey {
  monkey: number;
  starting: Array<bigint>;
  operation: string;
  test: bigint;
  trueTo: number;
  falseTo: number;
  inspections: number;
}

const transform = (rows: AOCInput) => {
  let monkeys: Monkey[] = [];
  for (let ii = 0; ii < rows.length; ii++) {
    if (rows[ii].match(/^Monkey/)) {
      let monkey = parseInt(rows[ii].match(/^Monkey (\d+)/)[1]);
      let starting = rows[ii + 1]
        .match(/Starting items\: (.+)/)[1]
        .split(', ')
        .map((x) => parseInt(x));
      let operation = rows[ii + 2].match(/Operation\: new \= (.+)/)[1];
      let operationvalue = operation.match(/(\w+)$/)[1];
      let test = parseInt(rows[ii + 3].match(/divisible by (\d+)/)[1]);
      let trueTo = parseInt(rows[ii + 4].match(/true\:.+(\d+)/)[1]);
      let falseTo = parseInt(rows[ii + 5].match(/false\:.+(\d+)/)[1]);
      monkeys.push({
        monkey,
        starting,
        operation,
        operationvalue,
        test,
        trueTo,
        falseTo,
        inspections: 0,
      });
    }
  }
  return monkeys;
};

const transformBig = (rows: AOCInput) => {
  let monkeys: BigMonkey[] = [];
  for (let ii = 0; ii < rows.length; ii++) {
    if (rows[ii].match(/^Monkey/)) {
      let monkey = parseInt(rows[ii].match(/^Monkey (\d+)/)[1]);
      let starting = rows[ii + 1]
        .match(/Starting items\: (.+)/)[1]
        .split(', ')
        .map((x) => BigInt(parseInt(x)));
      let operation = rows[ii + 2].match(/Operation\: new \= (.+)/)[1];
      // hacky
      if (operation.match(/(\d+)$/)) {
        operation = operation + 'n'; // bigint
      }
      let test = BigInt(parseInt(rows[ii + 3].match(/divisible by (\d+)/)[1]));
      let trueTo = parseInt(rows[ii + 4].match(/true\:.+(\d+)/)[1]);
      let falseTo = parseInt(rows[ii + 5].match(/false\:.+(\d+)/)[1]);
      monkeys.push({
        monkey,
        starting,
        operation,
        test,
        trueTo,
        falseTo,
        inspections: 0,
      });
    }
  }
  return monkeys;
};

export const part1 = (rows: AOCInput) => {
  let monkeys = transform(rows);
  let round = 0;
  // Rounds
  while (round < 20) {
    // monkey by monkey
    for (let monkey of monkeys) {
      // all items at once
      while (monkey.starting.length) {
        // remove first item
        let item = monkey.starting.shift();
        let old = item;
        item = eval(monkey.operation);
        item = <number>Math.floor(<number>item / 3);
        if (item % monkey.test == 0) {
          let toMonkey = monkeys.find((x) => x.monkey == monkey.trueTo);
          toMonkey.starting.push(item);
        } else {
          let falseMonkey = monkeys.find((x) => x.monkey == monkey.falseTo);
          falseMonkey.starting.push(item);
        }
        monkey.inspections++;
      }
    }
    round++;
  }
  return _.orderBy(monkeys, (monkey) => monkey.inspections, 'desc')
    .slice(0, 2)
    .reduce((mult, monk) => mult * monk.inspections, 1);
};

export const part2stackoverflow = (rows: AOCInput) => {
  let monkeys: BigMonkey[] = transformBig(rows);
  let round = 0;
  // Rounds
  while (round < 10000) {
    // monkey by monkey
    for (let monkey of monkeys) {
      // all items at once
      while (monkey.starting.length) {
        // remove first item
        let item = BigInt(monkey.starting.shift());
        let old = item;
        item = eval(monkey.operation);
        if (item % monkey.test == 0n) {
          let toMonkey = monkeys.find((x) => x.monkey == monkey.trueTo);
          toMonkey.starting.push(item);
        } else {
          let falseMonkey = monkeys.find((x) => x.monkey == monkey.falseTo);
          falseMonkey.starting.push(item);
        }
        monkey.inspections++;
      }
    }
    round++;
    if (round % 1000 === 0) console.log({ round, monkeys });
  }
  console.log(monkeys);
  return _.orderBy(monkeys, (monkey) => monkey.inspections, 'desc')
    .slice(0, 2)
    .reduce((mult, monk) => mult * monk.inspections, 1);
};

export const part2 = (rows: AOCInput) => {
  let monkeys = transform(rows);
  let round = 0;
  let commonDenominator = monkeys.reduce((mult, monk) => mult * monk.test, 1);

  // Rounds
  while (round < 10000) {
    // monkey by monkey
    for (let monkey of monkeys) {
      // all items at once
      while (monkey.starting.length) {
        // remove first item
        let item = monkey.starting.shift();
        let old = item;
        item = eval(monkey.operation);
        item %= commonDenominator;

        let trueFalse = item % monkey.test == 0;
        let throwTo = trueFalse
          ? monkeys.find((x) => x.monkey == monkey.trueTo)
          : monkeys.find((x) => x.monkey == monkey.falseTo);
        throwTo.starting.push(item);
        monkey.inspections++;
      }
    }
    round++;
  }
  return _.orderBy(monkeys, (monkey) => monkey.inspections, 'desc')
    .slice(0, 2)
    .reduce((mult, monk) => mult * monk.inspections, 1);
};
