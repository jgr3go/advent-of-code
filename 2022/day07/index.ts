import { AOCInput } from '../../interfaces';
import * as _ from 'lodash';

interface Node {
  name: string;
  dir: boolean;
  size: number;
  parent?: Node;
  dirs: Node[];
  files: Node[];
}

const transform = (rows: AOCInput) => {
  let head: Node = {
    name: '/',
    dir: true,
    size: 0,
    parent: null,
    dirs: [],
    files: [],
  };
  let cur = head;
  for (let ii = 0; ii < rows.length; ii++) {
    let line = rows[ii];
    // shell cmd
    if (line[0] == '$') {
      if (line.match('cd')) {
        let match = line.match(/cd (.+)/);
        if (match[1] == '/') {
          cur = head;
        } else if (match[1] == '..') {
          cur = cur.parent;
        } else {
          // assume you've ls'd the directory already?
          let exists = cur.dirs.find((x) => x.name == match[1]);
          if (exists) cur = exists;
        }
      } else if (line.match('ls')) {
        // short circuit outer loop
        while (rows[ii + 1] && rows[ii + 1][0] != '$') {
          let lsEntry = rows[ii + 1];
          // directory
          if (lsEntry.match(/^\d/)) {
            let file = lsEntry.match(/^(\d+) (.+)$/);
            let newFile: Node = {
              name: file[2],
              size: parseInt(file[1]),
              dir: false,
              dirs: null,
              files: null,
            };
            cur.files.push(newFile);
            // file
          } else {
            let match = lsEntry.match(/^dir (.+)$/);
            let newNode: Node = {
              name: match[1],
              parent: cur,
              dir: true,
              size: 0,
              dirs: [],
              files: [],
            };
            cur.dirs.push(newNode);
          }

          ii++;
        }
      }
    }
  }

  // I think you can DFS with a stack but i'm just gonna recurse
  sum(head);

  return head;
};

function sum(cur: Node) {
  for (let subdir of cur.dirs) {
    sum(subdir);
    cur.size += subdir.size;
  }
  cur.size += cur.files.reduce((sum, file) => sum + file.size, 0);
}

export const part1 = (rows: AOCInput) => {
  let head = transform(rows);

  // BFS since order doesn't matter
  let toVisit = [head];
  let isSmallEnough = [];
  while (toVisit.length) {
    let cur = toVisit.shift();
    toVisit.push(...cur.dirs);
    if (cur.size <= 100000) {
      isSmallEnough.push(cur);
    }
  }
  let total = isSmallEnough.reduce((sum, dir) => sum + dir.size, 0);
  return total;
};

export const part2 = (rows: AOCInput) => {
  let head = transform(rows);

  let possibleDeletes = [];
  let toVisit = [head];

  let neededMemory = 30000000;
  let systemMemory = 70000000;
  let currentMemory = head.size;

  while (toVisit.length) {
    let cur = toVisit.pop();
    toVisit.push(...cur.dirs);

    // if memory added back in after delete frees up enough include it
    if (systemMemory - currentMemory + cur.size >= neededMemory) {
      possibleDeletes.push(cur);
    }
  }

  let min = _.minBy(possibleDeletes, (x) => x.size);
  return min.size;
};
