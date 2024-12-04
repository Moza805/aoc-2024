import fs from "fs";

const grid = fs.readFileSync("./input.txt", "utf-8");
const rows = grid.split(/\r\n/);

const part1 = () => {
  const searchOffsets = [
    [-1, -1], // top left
    [-1, 0], // top
    [-1, 1], // top right
    [0, -1], // left
    [0, 1], // right
    [1, -1], // bottom left
    [1, 0], // bottom
    [1, 1], // bottom right
  ];

  const searchString = "XMAS";
  const startingLetter = searchString[0];

  let tally = 0;

  for (let rowIndex in rows) {
    let row = rows[rowIndex];

    for (let columnIndex in row) {
      // letter is X?
      if (row[columnIndex] !== startingLetter) {
        continue;
      }

      for (let offset of searchOffsets) {
        const [rowOffset, columnOffset] = offset;

        for (let i = 1; i < searchString.length; i++) {
          const searchLetter = searchString[i];
          const offsetLetter =
            rows[+rowIndex + i * rowOffset]?.[+columnIndex + i * columnOffset];

          if (offsetLetter === searchLetter) {
            if (i === searchString.length - 1) {
              tally++;
              break;
            }
            continue;
          }
          break;
        }
      }
    }
  }

  return tally;
};

const part2 = () => {
  let tally = 0;
  for (let rowIndexString in rows) {
    const rowIndex = +rowIndexString;

    for (let columnIndexString in rows[rowIndex]) {
      const columnIndex = +columnIndexString;

      const edgeValues = ["M", "S"];

      const isXMAS =
        rows[rowIndex][columnIndex] === "A" &&
        edgeValues.includes(rows[rowIndex - 1]?.[columnIndex - 1]) &&
        edgeValues.includes(rows[rowIndex - 1]?.[columnIndex + 1]) &&
        edgeValues.includes(rows[rowIndex + 1]?.[columnIndex - 1]) &&
        edgeValues.includes(rows[rowIndex + 1]?.[columnIndex + 1]) &&
        rows[rowIndex - 1][columnIndex - 1] !==
          rows[rowIndex + 1][columnIndex + 1] &&
        rows[rowIndex - 1][columnIndex + 1] !==
          rows[rowIndex + 1][columnIndex - 1];

      if (isXMAS) {
        tally++;
      }
    }
  }
  return tally;
};

console.log(part1());
console.log(part2());
