import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';
import { maxBy, minBy } from 'lodash';

interface INode {
  x: number;
  y: number;
  letter: string;
  level: number;
}
class Node implements INode {
  x: number;
  y: number;
  letter: string;
  level: number;
  distance: number = Number.MAX_VALUE;
  connected: Node[] = [];
  visited: boolean = false;

  constructor(x: number, y: number, letter: string, level: number) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.level = level;
  }
}

class Graph {
  nodesDict: { [xy: string]: Node } = {};
  start: Node;
  end: Node;

  setStart(start: INode) {
    this.start = this.addAndGetNode(start);
    this.start.distance = 0;
  }
  setEnd(end: INode) {
    this.end = this.addAndGetNode(end);
  }

  addConnection(from: INode, to: INode) {
    let gfrom = this.addAndGetNode(from);
    let gto = this.addAndGetNode(to);
    if (!gfrom.connected.includes(gto)) {
      gfrom.connected.push(gto);
    }
  }

  getNode(x: number, y: number) {
    return this.nodesDict[this.key(x, y)];
  }

  addAndGetNode(node: INode): Node {
    let key = this.key(node.x, node.y);
    if (!this.nodesDict[key]) {
      let gnode = new Node(node.x, node.y, node.letter, node.level);
      this.nodesDict[key] = gnode;
    }
    return this.nodesDict[key];
  }

  key(x: number, y: number) {
    return `${x}-${y}`;
  }
}

function getLevel(letter: string) {
  let MIN = 'a'.charCodeAt(0);
  if (!letter) return undefined;
  if (letter == 'S') return 0;
  if (letter == 'E') return 'z'.charCodeAt(0) - MIN;
  return letter.charCodeAt(0) - MIN;
}

const transform = (rows: AOCInput) => {
  let matrix = rows.map((row) => row.split(''));
  let graph = new Graph();

  for (let ii = 0; ii < matrix.length; ii++) {
    for (let jj = 0; jj < matrix[0].length; jj++) {
      let current = matrix[ii][jj];
      let currentLevel = getLevel(current);
      let up = matrix[ii - 1]?.[jj];
      let upLevel = getLevel(up);
      let down = matrix[ii + 1]?.[jj];
      let downLevel = getLevel(down);
      let left = matrix[ii][jj - 1];
      let leftLevel = getLevel(left);
      let right = matrix[ii][jj + 1];
      let rightLevel = getLevel(right);

      let cNode: INode = { x: ii, y: jj, letter: current, level: currentLevel };
      let upNode: INode = { x: ii - 1, y: jj, letter: up, level: upLevel };
      let downNode: INode = {
        x: ii + 1,
        y: jj,
        letter: down,
        level: downLevel,
      };
      let leftNode: INode = {
        x: ii,
        y: jj - 1,
        letter: left,
        level: leftLevel,
      };
      let rightNode: INode = {
        x: ii,
        y: jj + 1,
        letter: right,
        level: rightLevel,
      };

      if (upLevel != undefined && currentLevel + 1 >= upLevel) {
        graph.addConnection(cNode, upNode);
      }
      if (downLevel != undefined && currentLevel + 1 >= downLevel) {
        graph.addConnection(cNode, downNode);
      }
      if (leftLevel != undefined && currentLevel + 1 >= leftLevel) {
        graph.addConnection(cNode, leftNode);
      }
      if (rightLevel != undefined && currentLevel + 1 >= rightLevel) {
        graph.addConnection(cNode, rightNode);
      }

      if (current == 'S') {
        graph.setStart(cNode);
      }
      if (current == 'E') {
        graph.setEnd(cNode);
      }
    }
  }

  return graph;
};

export const part1 = (rows: AOCInput) => {
  let graph = transform(rows);

  let toTraverse = [graph.start];
  while (toTraverse.length) {
    let current = toTraverse.shift();
    current.visited = true;
    let distance = current.distance;

    for (let conn of current.connected) {
      if (conn.distance > distance + 1) {
        conn.distance = distance + 1;
        toTraverse.push(conn);
      }
    }
  }
  return graph.end.distance;
};

export const part2 = (rows: AOCInput) => {
  let graph = transform(rows);

  let allLevel0s = Object.values(graph.nodesDict).filter(
    (node) => node.level == 0
  );
  let allDistances = [];
  for (let start of allLevel0s) {
    // in hindsight this was probably way worse than just resetting all levels to MAX but whatever
    let newGraph = transform(rows);
    newGraph.setStart(start);

    let toTraverse = [newGraph.start];
    while (toTraverse.length) {
      let current = toTraverse.shift();
      current.visited = true;
      let distance = current.distance;

      for (let conn of current.connected) {
        if (conn.distance > distance + 1) {
          conn.distance = distance + 1;
          toTraverse.push(conn);
        }
      }
    }
    allDistances.push(newGraph.end.distance);
  }

  return minBy(allDistances);
};
