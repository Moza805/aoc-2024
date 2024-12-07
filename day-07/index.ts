import { readFileSync } from "fs";

const data = readFileSync("./sample-input.txt", "utf-8");
const rawCalibrations = data.split(/\r\n/) as string[];

const parseRawCalibrations = (rawValue: string): Calibration => {
  let rawParts = rawValue.split(":");
  let sum = +rawParts[0];
  let parts = rawParts[1].match(/\d+/g).map((x) => +x);

  return { sum, parts };
};

const add: OperationFunction = (a, b) => a + b;
const multiply: OperationFunction = (a, b) => a * b;
const concatenate: OperationFunction = (a, b) => +`${a}${b}`;

const calculateCalibration = (
  parts: number[],
  operations: OperationFunction[]
): number[] => {
  let results = operations.map((x) => x(parts[0], parts[1]));
  
  if (parts.length > 2) {
    const nextParts = parts.slice(2);
    const subResults: number[] = [];

    for (let result of results) {
      subResults.push(...calculateCalibration([result, ...nextParts], operations));
    }

    return subResults;
  }

  return results;
};

function calcuateTotalCalibration(
  rawCalibrations: string[],
  operations: OperationFunction[]
) {
  let validValueSum = 0;

  for (let rawCalibration of rawCalibrations) {
    const testValue = parseRawCalibrations(rawCalibration);

    const options = calculateCalibration(testValue.parts, operations);

    if (options.includes(testValue.sum)) {
      validValueSum += testValue.sum;
    }
  }

  return validValueSum;
}

console.log(calcuateTotalCalibration(rawCalibrations, [add, multiply]));
console.log(calcuateTotalCalibration(rawCalibrations, [add, multiply, concatenate]));

type OperationFunction = (a: number, b: number) => number;

type Calibration = {
  sum: number;
  parts: number[];
};
