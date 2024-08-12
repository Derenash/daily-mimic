import { groupSide as side } from "../constants/index.js";
import { GroupSide } from "../types/blobTypes.js";

export enum DifficultyLevel {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard"
}

export interface DifficultyConfig {
  blobCount: number;
  distribution: Record<GroupSide, number>;
  liarCount: {
    min: number;
    max: number;
  };
}

export const difficultyConfigs: Record<DifficultyLevel, DifficultyConfig> = {
  [DifficultyLevel.Easy]: {
    blobCount: 4,
    distribution: { [side.LEFT]: 2, [side.RIGHT]: 2, [side.TOP]: 0, [side.BOTTOM]: 0 },
    liarCount: { min: 1, max: 1 }
  },
  [DifficultyLevel.Medium]: {
    blobCount: 6,
    distribution: { [side.LEFT]: 2, [side.RIGHT]: 2, [side.TOP]: 0, [side.BOTTOM]: 2 },
    liarCount: { min: 1, max: 2 }
  },
  [DifficultyLevel.Hard]: {
    blobCount: 9,
    distribution: { [side.LEFT]: 3, [side.RIGHT]: 3, [side.TOP]: 0, [side.BOTTOM]: 3 },
    liarCount: { min: 1, max: 4 }
  }
};
