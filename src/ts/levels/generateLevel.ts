import { blobColor as col, blobType as type, groupSide as side } from "../constants/index.js";
import { clueAll, clueColor, clueSide, clueSpecific, newBlob } from "../blob/index.js";
import { Level, Blob, BlobColor, GroupSide, Clue, ClueTarget } from "../types/blobTypes.js";
import { blobNamesPTBR } from "../constants/blobNames.js";
import { difficultyConfigs, DifficultyLevel } from "../types/difficulty.js";

// Simple custom random number generator
class SimpleRNG {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

function generateRandomClue(
  rng: SimpleRNG,
  existingBlobs: Blob[],
  liarCount: { min: number; max: number },
  clueTypeProbabilities: [number, number, number, number] // [colorProb, sideProb, specificProb, allProb]
): Clue {
  const isFixedLiar = liarCount.min === liarCount.max;
  const sides = Object.values(side);
  const getRandomType = () => rng.next() > 0.5 ? type.TRUTH : type.LIE;

  function getRandomTarget(count: number): ClueTarget {
    if (count === 1) return { type: "all" };
    const targetType = rng.next();
    if (targetType < 0.33) return { type: "all" };
    if (targetType < 0.66) return { type: "some" };
    const max = Math.floor(rng.next() * (count - 1)) + 1;
    const min = Math.floor(rng.next() * max) + 1;
    return { type: "range", minimum: min, maximum: max };
  }

  // Adjust probabilities if isFixedLiar
  const adjustedProbs = isFixedLiar
    ? [clueTypeProbabilities[0], clueTypeProbabilities[1], clueTypeProbabilities[2], 0]
    : clueTypeProbabilities;

  const totalProb = adjustedProbs.reduce((sum, prob) => sum + prob, 0);
  const randomValue = rng.next() * totalProb;
  let cumulativeProb = 0;
  let clueType = 0;

  for (let i = 0; i < adjustedProbs.length; i++) {
    cumulativeProb += adjustedProbs[i];
    if (randomValue <= cumulativeProb) {
      clueType = i;
      break;
    }
  }

  switch (clueType) {
    case 0: // Color clue
      const existingColors = [...new Set(existingBlobs.map(blob => blob.color))];
      const randomColor = existingColors[Math.floor(rng.next() * existingColors.length)];
      const colorCount = existingBlobs.filter(blob => blob.color === randomColor).length;
      return clueColor(getRandomTarget(colorCount), randomColor, getRandomType());

    case 1: // Side clue
      const sidesWithBlobs = sides.filter(s => existingBlobs.some(blob => blob.side === s));
      if (sidesWithBlobs.length === 0) return clueAll(0);
      const randomSide = sidesWithBlobs[Math.floor(rng.next() * sidesWithBlobs.length)] as GroupSide;
      const sideCount = existingBlobs.filter(blob => blob.side === randomSide).length;
      return clueSide(getRandomTarget(sideCount), randomSide, getRandomType());

    case 2: // Specific clue
      const randomBlob = existingBlobs[Math.floor(rng.next() * existingBlobs.length)];
      return clueSpecific(randomBlob.name, getRandomType());

    case 3: // All clue
      return clueAll(Math.floor(rng.next() * (liarCount.max - liarCount.min + 1)) + liarCount.min);

    default:
      return clueAll(0);
  }
}

export function generateRandomLevel(difficulty: DifficultyLevel, seed?: string): Level {
  const actualSeed = seed || Math.random().toString(36).substring(2, 15);
  const rng = new SimpleRNG(actualSeed);

  const config = difficultyConfigs[difficulty];
  const blobs: Blob[] = [];
  const colors = Object.values(col);
  const usedNames = new Set<string>();

  // Generate blobs with colors and sides
  Object.entries(config.distribution).forEach(([sideKey, count]) => {
    const currentSide = sideKey as GroupSide;
    for (let i = 0; i < count; i++) {
      let name;
      do {
        name = blobNamesPTBR[Math.floor(rng.next() * blobNamesPTBR.length)];
      } while (usedNames.has(name));
      usedNames.add(name);

      const color = colors[Math.floor(rng.next() * colors.length)] as BlobColor;
      blobs.push(newBlob(name, color, clueAll(0), currentSide));
    }
  });

  // Generate clues for each blob
  blobs.forEach(blob => {
    blob.clue = generateRandomClue(rng, blobs, config.liarCount, [8, 4, 2, 1]);
  });

  return {
    name: `${difficulty} Level`,
    minimumLiers: config.liarCount.min,
    maximumLiers: config.liarCount.max,
    blobs,
    seed: actualSeed,
  };
}