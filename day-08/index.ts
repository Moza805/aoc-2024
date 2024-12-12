import { readFileSync } from "fs";

const data = readFileSync("./input.txt", "utf-8");

const illegalValues = ["\r", "\n", "."];

const debug = (data: string, nodes: GridNode[]) => {
  const grid = constructGrid(data);

  nodes.forEach((node, index) => {
    console.log(`${index}: ${JSON.stringify(node)}`);
    grid[node.y][node.x] = "#";
  });

  console.log(grid.map((row) => row.join("")).join("\r\n"));
};

const constructGrid = (data: string) =>
  data.split("\r\n").map((row) => row.split(""));

const getGridSize = (grid: string[][]): GridSize => ({
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
    const nodeIndex = +nodeIndexString;
    const node = nodes[+nodeIndex];

    const remainingNodes = nodes
      .slice(nodeIndex + 1)
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

const part2 = (data: string) => {
  const grid = constructGrid(data);
  const gridSize = getGridSize(grid);

  const antinodes: GridNode[] = [];

  const nodes: GridNode[] = grid
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

  const nodeCounts = nodes.reduce(
    (agg: { [name: string]: number }, curr: GridNode) => {
      if (agg[curr.type]) {
        agg[curr.type]++;
      } else {
        agg[curr.type] = 1;
      }
      return agg;
    },
    {}
  );

  for (let nodeIndexString in nodes) {
    const nodeIndex = +nodeIndexString;
    const node = nodes[+nodeIndex];

    if (nodeCounts[node.type] > 1) {
      antinodes.push(node);
    }

    let remainingNodes = nodes
      .slice(nodeIndex + 1)
      .filter((x) => x.type === node.type);

    remainingNodes.forEach((remainingNode) => {
      const xDiff = remainingNode.x - node.x;
      const yDiff = remainingNode.y - node.y;

      let multiplier = 1;

      do {
        let nextInBounds = true;
        let previousInBounds = true;

        const projectedNextAntinode: GridNode = {
          type: node.type,
          y: remainingNode.y + yDiff * multiplier,
          x: remainingNode.x + xDiff * multiplier,
        };

        const projectedPreviousAntinode: GridNode = {
          type: node.type,
          y: node.y - yDiff * multiplier,
          x: node.x - xDiff * multiplier,
        };

        if (
          projectedNextAntinode.x >= 0 &&
          projectedNextAntinode.x < gridSize.width &&
          projectedNextAntinode.y >= 0 &&
          projectedNextAntinode.y < gridSize.height
        ) {
          antinodes.push(projectedNextAntinode);
        } else {
          nextInBounds = false;
        }

        if (
          projectedPreviousAntinode.x >= 0 &&
          projectedPreviousAntinode.x < gridSize.width &&
          projectedPreviousAntinode.y >= 0 &&
          projectedPreviousAntinode.y < gridSize.height
        ) {
          antinodes.push(projectedPreviousAntinode);
          previousInBounds = false;
        }

        if (!nextInBounds && previousInBounds) {
          break;
        }

        multiplier++;
      } while (true);
    });
  }

  return [...new Set(antinodes.map((an) => `${an.x},${an.y}`))].length;
};

console.log(part1(data));
console.log(part2(data));

type GridSize = {
  width: number;
  height: number;
};

type GridNode = {
  type: string;
  x: number;
  y: number;
};
