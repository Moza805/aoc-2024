import fs from "fs";

const multiplierInstructionPattern = /mul\(\d+\,\d+\)/g;

const part1 = (instructions) =>
  instructions
    .match(multiplierInstructionPattern)
    .reduce((aggregate, current) => {
      const matches = current.match(/\d+/g).map((x) => +x);

      return (aggregate += matches[0] * matches[1]);
    }, 0);

const part2 = (instructions) => {
  let total = 0;

  const multiplierInstructions = [
    ...instructions.matchAll(multiplierInstructionPattern),
  ];

  // Probably a regex pattern that matches strings that
  // start with 'do()' or is start of string
  // and do not contain a don't before ending with mult(x,y)
  //
  // would be better but time limited!
  // const reg = [...instructions.matchAll(/(?:do\(\)|^.*)(mul\(\d+\,\d+\))/g)];
  const doMatches = [...instructions.matchAll(/do\(\)/g)];
  const dontMatches = [...instructions.matchAll(/don\'t\(\)/g)];

  for (const multiplier of multiplierInstructions) {
    const precedingDo = doMatches.filter((x) => x.index < multiplier.index);
    const precedingDont = dontMatches.filter((x) => x.index < multiplier.index);

    const numbers = multiplier[0].match(/\d+/g).map((x) => +x);

    if (
      (precedingDo[precedingDo.length - 1]?.index ?? 0) >
      (precedingDont[precedingDont.length - 1]?.index ?? -1)
    ) {
      total += numbers[0] * numbers[1];
    }
  }

  return total;
};

const instructions = fs.readFileSync("./sample-input.txt", "utf-8");

console.log(part1(instructions));
console.log(part2(instructions));
