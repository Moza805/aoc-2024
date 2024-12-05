import { readFileSync } from "fs";

const protocols = readFileSync("./sample-input.txt", "utf-8");
const lines = protocols.split(/\r\n/);

const rules: Rule[] = [];
const updates: Update[] = [];

const getDepth = (rule: SortedRule, depth = 0): number[] => {
  if (!rule.followedBy.length) {
    return [rule.page];
  }

  const nextLayerPages = rule.followedBy.map((r) => getDepth(r, depth + 1));
  nextLayerPages.sort((a, b) => b.length - a.length);

  return [rule.page, ...nextLayerPages[0]];
};

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
  const sortedUpdates = [];

  for (let update of invalidUpdates) {
    let applicableRules = rules.filter(
      (rule) =>
        update.pages.includes(rule.page) &&
        update.pages.includes(rule.precededBy)
    );

    const ruleChain: SortedRule[] = [
      ...applicableRules.map((r, id) => ({ ...r, followedBy: [], id })),
    ];

    for (let rule of ruleChain) {
      rule.followedBy = ruleChain.filter((x) => x.precededBy === rule.page);
    }

    const firstPage = update.pages.find(
      (page) =>
        applicableRules.some((rule) => rule.precededBy === page) &&
        applicableRules.every((rule) => rule.page !== page)
    );

    const firstRules = ruleChain.filter(
      (rule) => rule.precededBy === firstPage
    );

    const chains = firstRules.map(getDepth);
    chains.sort((a, b) => b.length - a.length);

    const orderedPages = [firstPage, ...chains[0]];

    sortedUpdates.push({ pages: orderedPages });
  }

  return sortedUpdates;
};

const part1Result = part1();

console.log(
  part1Result.validUpdates.reduce(
    (aggregate, update) =>
      (aggregate += update.pages[Math.floor(update.pages.length / 2)]),
    0
  )
);

console.log(
  part2(part1Result.invalidUpdates).reduce(
    (aggregate, update) =>
      (aggregate += update.pages[Math.floor(update.pages.length / 2)]),
    0
  )
);

type Rule = {
  precededBy: number;
  page: number;
};

type SortedRule = Rule & {
  followedBy: SortedRule[];
  id: number;
};

type Update = {
  pages: number[];
};
