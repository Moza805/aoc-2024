import fs from "fs";

const reports = fs.readFileSync("./input.txt", "utf-8").split(/\r?\n/);

const isReportSafe = (readings) => {
  let isSafe = true;

  for (let readingIndexString in readings) {
    const readingIndex = +readingIndexString;

    let previousReading = readings[readingIndex - 1];
    let reading = readings[readingIndex];
    let nextReading = readings[readingIndex + 1];

    if (nextReading === undefined) {
      break;
    }

    const readingDifference = Math.abs(reading - nextReading);

    if (readingDifference < 1 || readingDifference > 3) {
      isSafe = false;
      break;
    }

    const signFromPrevious = Math.sign(previousReading - reading);
    const signToNext = Math.sign(reading - nextReading);

    if (
      previousReading !== undefined &&
      nextReading !== undefined &&
      signFromPrevious !== signToNext
    ) {
      isSafe = false;
      break;
    }
  }

  return isSafe;
};

const part1 = () => {
  let safeReportCount = 0;

  for (let report of reports) {
    const readings = report.split(" ").map((x) => +x);
    isReportSafe(readings) && safeReportCount++;
  }

  return safeReportCount;
};

const part2 = () => {
  let safeReportCount = 0;

  for (let report of reports) {
    const readings = report.split(" ").map((x) => +x);
    const baseReportIsSafe = isReportSafe(readings);

    if (baseReportIsSafe) {
      safeReportCount++;
      continue;
    }

    // Surely a more intelligent way to approach this
    // than removing one value at a time and checking the string
    for (let i = 0; i < readings.length; i++) {
      let alteredReadings = [...readings];
      alteredReadings.splice(i, 1);

      if (isReportSafe(alteredReadings)) {
        safeReportCount++;
        break;
      }
    }
  }

  return safeReportCount;
};

console.log(part1());
console.log(part2());
