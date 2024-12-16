import { readFileSync } from "fs";

const diskMap = readFileSync("./input.txt", "utf-8");

const expandDiskMap = (diskMap: string): (string | undefined)[] =>
  diskMap
    .split("")
    .map((x) => +x)
    .reduce((diskContent, block, index) => {
      const newDiskContent = [...diskContent];
      const isSpace = index % 2 === 1;
      const fileIndex = index / 2;

      const newBlocks = new Array(block).fill(isSpace ? undefined : fileIndex);

      newDiskContent.push(...newBlocks);
      return newDiskContent;
    }, []);

const blockLevelDefrag = (disk: (string | undefined)[]) => {
  const dataBlockCount = disk.filter((x) => x !== undefined).length;
  let defragged = [...disk];

  while (defragged.indexOf(undefined) < dataBlockCount) {
    const blockToMove = defragged.findLastIndex((x) => x !== undefined);
    const moveTo = defragged.findIndex((x) => x === undefined);

    defragged[moveTo] = defragged[blockToMove];

    defragged[blockToMove] = undefined;
  }

  return defragged;
};

const fileLevelDefrag = (disk:(string | undefined)[]) => {
  
}

const calculateChecksum = (disk: (string | undefined)[]) =>
  disk
    .filter((x) => x !== undefined)
    .reduce((checksum, block, index) => (checksum += +block * index), 0);

const part1 = (data) => {
  const diskContent = expandDiskMap(data);

  const defragged = blockLevelDefrag(diskContent);

  const checksum = calculateChecksum(defragged);

  return checksum;
};

const part2 = (data: string) => {};

console.log(part1(diskMap));
console.log(part2(diskMap));
