import { readFileSync } from "fs";

const protocols = readFileSync("./sample-input.txt", "utf-8");
const lines = protocols.split(/\r\n/);

const rules: Rule[] = [];
const updates: Update[] = [];

for (let line of lines) {
  if (line.indexOf("|") > -1) {
    const values = line.split("|").map((x) => +x);

    rules.push({ precededBy: values[0], page: values[1] });
    continue;
  }

  if (line.indexOf(",") > -1) {
    const pages = line.split(",").map((x) => +x);
    updates.push({ pages });
  }
}

const part1 = () => {
  const validUpdates: Update[] = [];
  const invalidUpdates: Update[] = [];

  for (let updateIndexString in updates) {
    const update = updates[+updateIndexString];

    let reversedPages = [...update.pages].reverse();
    let valid = true;

    while (reversedPages.length > 0 && valid) {
      const page = reversedPages[0];
      const remainingPages = reversedPages.slice(1);
      const applicableRules = rules.filter(
        (rule) => rule.page === page && update.pages.includes(rule.precededBy)
      );
      const requiredPages = applicableRules.map((rule) => rule.precededBy);

      if (
        !requiredPages.every((requiredPage) =>
          remainingPages.includes(requiredPage)
        )
      ) {
        valid = false;
        break;
      }

      reversedPages = remainingPages;
    }

    if (valid) {
      validUpdates.push(update);
    } else {
      invalidUpdates.push(update);
    }
  }

  return { validUpdates, invalidUpdates };
};

const part2 = (invalidUpdates: Update[]) => {
  // a full chain with have the same length as the number of pages
  // so i suspect that there will only be one full length chain

  for (let update of invalidUpdates) {
    const sortedPages = [...update.pages];

    let applicableRules = rules.filter(
      (rule) =>
        update.pages.includes(rule.page) &&
        update.pages.includes(rule.precededBy)
    );

    const firstPages = update.pages.filter(
      (page) =>
        applicableRules.some((rule) => rule.precededBy === page) &&
        applicableRules.every((rule) => rule.page !== page)
    );

    const lastPages = update.pages.filter(
      (page) =>
        applicableRules.some((rule) => rule.page === page) &&
        applicableRules.every((rule) => rule.precededBy !== page)
    );

    if (firstPages.length > 1 || lastPages.length > 1) {
      throw new Error("Unexpected rule chain");
    }

    const firstPage = firstPages[0];
    const lastPage = lastPages[1];

    let currentPage = firstPage;

    const firstRule = applicableRules.filter(
      (rule) => rule.precededBy === firstPage
    );

    console.log(firstRule);
  }
};

const part1Result = part1();

console.log(
  part1Result.validUpdates.reduce(
    (aggregate, update) =>
      (aggregate += update.pages[Math.floor(update.pages.length / 2)]),
    0
  )
);

console.log(part2(part1Result.invalidUpdates));

type Rule = {
  precededBy: number;
  page: number;
};

type Update = {
  pages: number[];
};
