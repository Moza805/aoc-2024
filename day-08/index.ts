import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf-8");

const illegalValues = ["\r", "\n", "."];

const constructGrid = (data: string) =>
  data.split("\r\n").map((row) => row.split(""));

const getNodeTypes = (data: string) => {
  return [...new Set(data.split(""))].filter(
    (x: string) => !illegalValues.includes(x)
  );
};

const getGridSize = (grid: string[][]) => ({
  width: grid[0].length,
  height: grid.length,
});

const part1 = (data) => {
  const grid = constructGrid(data);
  const gridSize = getGridSize(grid);

  const antinodes = [];

  const nodes = grid
    .map((row, y) =>
      row.map((type, x) => {
        if (!!illegalValues.includes(type)) {
          return;
        }

        return { type, y, x };
      })
    )
    .flat()
    .filter(Boolean);

  for (let nodeIndexString in nodes) {
    const node = nodes[+nodeIndexString];

    const remainingNodes = nodes
      .slice(+nodeIndexString + 1)
      .filter((x) => x.type === node.type);

    remainingNodes.forEach((remainingNode) => {
      const xDiff = remainingNode.x - node.x;
      const yDiff = remainingNode.y - node.y;

      const projectedNextAntinode = {
        type: node.type,
        y: remainingNode.y + yDiff,
        x: remainingNode.x + xDiff,
      };

      const projectedPreviousAntinode = {
        type: node.type,
        y: node.y - yDiff,
        x: node.x - xDiff,
      };

      if (
        projectedNextAntinode.x >= 0 &&
        projectedNextAntinode.x < gridSize.width &&
        projectedNextAntinode.y >= 0 &&
        projectedNextAntinode.y < gridSize.height
      ) {
        antinodes.push(projectedNextAntinode);
      }

      if (
        projectedPreviousAntinode.x >= 0 &&
        projectedPreviousAntinode.x < gridSize.width &&
        projectedPreviousAntinode.y >= 0 &&
        projectedPreviousAntinode.y < gridSize.height
      ) {
        antinodes.push(projectedPreviousAntinode);
      }
    });
  }

  return [...new Set(antinodes.map((an) => `${an.x},${an.y}`))].length;
};

console.log(part1(data));
