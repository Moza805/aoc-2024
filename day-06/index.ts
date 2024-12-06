import { readFileSync } from "fs";

const protocols = readFileSync("./input.txt", "utf-8");
const grid = protocols.split(/\r\n/).map((x) => x.split("")) as Grid;

type Grid = GridLocationType[][];

const GUARD_FACING = ["^", ">", "v", "<"] as const;
const guardFacing = [...GUARD_FACING][0];
type GuardFacing = typeof guardFacing;

type GridLocation = { x: number; y: number };

type GridLocationType = "." | "#" | "@" | "O" | GuardFacing;

type GridSize = {
  width: number;
  height: number;
};
const directions = {
  "^": [-1, 0],
  ">": [0, 1],
  "<": [0, -1],
  v: [1, 0],
};

type Guard = {
  position: GridLocation;
  facing: GuardFacing;
};

type VisitedLocation = Guard;

const rotateGuard = (current: GuardFacing): GuardFacing => {
  switch (current) {
    case "<":
      return "^";
    case ">":
      return "v";
    case "^":
      return ">";
    case "v":
      return "<";
  }
};

const findGuard = (grid: Grid): Guard => {
  for (let rowIndexString in grid) {
    const row = grid[+rowIndexString];

    const guardIndex = row.findIndex((gridLocation) =>
      guardFacing.includes(gridLocation as GuardFacing)
    );
    if (guardIndex > -1) {
      return {
        position: { y: +rowIndexString, x: guardIndex },
        facing: row[guardIndex] as GuardFacing,
      };
    }
  }
  throw new Error("No guard found");
};

const guardIsInBounds = (
  guardPosition: GridLocation,
  gridSize: GridSize
): boolean => {
  return (
    guardPosition.x >= 0 &&
    guardPosition.x < gridSize.width &&
    guardPosition.y >= 0 &&
    guardPosition.y < gridSize.height
  );
};
const gridSize: GridSize = { height: grid.length, width: grid[0].length };

const getGuardPath = (
  grid: Grid,
  guardStartsAt: Guard
): { visited: VisitedLocation[]; isLoop: boolean } => {
  let guard: Guard = {
    facing: guardStartsAt.facing,
    position: { ...guardStartsAt.position },
  };

  let visited: VisitedLocation[] = [
    { position: { ...guardStartsAt.position }, facing: guardStartsAt.facing },
  ];

  let isLoop = false;

  while (guardIsInBounds(guard.position, gridSize)) {
    const offset = directions[guard.facing];
    const nextLocation: GridLocation = {
      y: guard.position.y + offset[0],
      x: guard.position.x + offset[1],
    };

    const inFrontOfGuard: GridLocationType =
      grid[nextLocation.y]?.[nextLocation.x];

    if (inFrontOfGuard === undefined) {
      break;
    }

    if (inFrontOfGuard === "#" || inFrontOfGuard === "O") {
      guard.facing = rotateGuard(guard.facing);
      continue;
    }

    if (
      visited.some(
        (x) =>
          x.facing === guard.facing &&
          x.position.x === nextLocation.x &&
          x.position.y === nextLocation.y
      )
    ) {
      isLoop = true;
      break;
    }

    guard.position = nextLocation;
    visited.push({ position: nextLocation, facing: guard.facing });
  }

  return { visited: [...new Set(visited)], isLoop };
};

const part1 = () =>
  [
    ...new Set(
      getGuardPath(grid, findGuard(grid)).visited.map(
        (loc) => `${loc.position.x},${loc.position.y}`
      )
    ),
  ].length;

const part2 = () => {
  let loopLocations: GridLocation[] = [];
  const guardStartsAt = findGuard(grid);
  const guard = findGuard(grid);
  let editedGrid = [...grid.map((row) => row.map((cell) => cell))];

  while (guardIsInBounds(guard.position, gridSize)) {
    const offset = directions[guard.facing];
    const nextLocation: GridLocation = {
      y: guard.position.y + offset[0],
      x: guard.position.x + offset[1],
    };

    const inFrontOfGuard: GridLocationType =
      editedGrid[nextLocation.y]?.[nextLocation.x];

    if (inFrontOfGuard === "#" || inFrontOfGuard === "O") {
      guard.facing = rotateGuard(guard.facing);
      continue;
    }

    if (inFrontOfGuard === undefined) {
      break;
    }

    if ([".", "^", "@"].includes(inFrontOfGuard)) {
      editedGrid[nextLocation.y][nextLocation.x] = "O";

      const { isLoop } = getGuardPath(editedGrid, guardStartsAt);
      if (isLoop) {
        loopLocations.push(nextLocation);
        editedGrid = [...grid.map((row) => row.map((cell) => cell))];
        console.log("loop", nextLocation);
      }

      editedGrid[nextLocation.y][nextLocation.x] = "@";
      guard.position = nextLocation;
    }
  }

  return [...new Set(loopLocations.map((loc) => `${loc.x},${loc.y}`))].length;
};

console.log(part1());
console.log(part2());
