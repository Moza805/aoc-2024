import fs from "fs";

const lines = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const leftList = [];
const rightList = [];

for (let line of lines) {
  var split = line.split(/[ ]+/);
  leftList.push(+split[0]);
  rightList.push(+split[1]);
}
const sortedLeftList = [...leftList].sort();
const sortedRightList = [...rightList].sort();

const part1 = () => {
  let totalDistance = 0;

  for (let i in sortedLeftList) {
    totalDistance += Math.abs(sortedLeftList[i] - sortedRightList[i]);
  }
  return totalDistance;
};

const part2 = () => {
  let sum = 0;

  for (let line of leftList) {
    const firstIndex = sortedRightList.indexOf(line);

    if (firstIndex < 0) {
      continue;
    }

    const lastIndex = sortedRightList.lastIndexOf(line);

    const diff = lastIndex - firstIndex + 1;
    sum += line * diff;
  }

  return sum;
};

// console.log(part1());
console.log(part2());
