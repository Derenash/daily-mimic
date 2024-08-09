import { Level } from "../types";
import { tutorial1, tutorial2, level1, level2 } from "./index.js";

export const levelsMap: Map<string, Level> = new Map([
  ["tutorial1", tutorial1()],
  ["tutorial2", tutorial2()],
  ["level1", level1()],
  ["level2", level2()]
]);
