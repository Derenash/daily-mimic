import { blobColor as col, blobType as type, groupSide as side, blobType } from "../constants/index.js";
import { clueAll, clueColor, clueSide, clueSpecific, newBlob } from "../blob/index.js";
import { Level, Blob, BlobColor, GroupSide, Clue, ClueTarget } from "../types/blobTypes.js";
import { blobNamesPTBR } from "../constants/blobNames.js";

// Define the difficulty levels
type Difficulty = 1 | 2 | 3;

// Function to determine the number of blobs based on difficulty
function getBlobCount(difficulty: Difficulty): number {
  switch (difficulty) {
    case 1: return 4;
    case 2: return 6;
    case 3: return 8;
    default: return 4;
  }
}

// Function to determine the number of liars based on difficulty and blob count
function getLiarCountRange(difficulty: Difficulty, blobCount: number): [number, number] {
  switch (difficulty) {
    case 1: return [1, 1];
    case 2: return [1, Math.floor(blobCount / 2) - 1];
    case 3: return [1, Math.floor(blobCount / 2) - 1];
    default: return [1, 1];
  }
}

// Function to get blob distribution based on blob count
function getBlobDistribution(blobCount: number): Record<GroupSide, number> {
  switch (blobCount) {
    case 4: return { [side.LEFT]: 2, [side.RIGHT]: 2, [side.TOP]: 0, [side.BOTTOM]: 0 };
    case 6: return { [side.LEFT]: 2, [side.RIGHT]: 2, [side.TOP]: 0, [side.BOTTOM]: 2 };
    case 8: return { [side.LEFT]: 3, [side.RIGHT]: 3, [side.TOP]: 0, [side.BOTTOM]: 3 };
    default: return { [side.LEFT]: 2, [side.RIGHT]: 2, [side.TOP]: 0, [side.BOTTOM]: 0 };
  }
}

function generateRandomClue(
  existingBlobs: Blob[],
  minLiars: number,
  maxLiars: number,
  clueTypeProbabilities: number[] // [colorProb, sideProb, specificProb, allProb]
): Clue {
  const isFixedLiar = minLiars === maxLiars;
  const sides = Object.values(side);
  const getRandomType = () => Math.random() > 0.5 ? type.TRUTH : type.LIE;

  function getRandomTarget(count: number): ClueTarget {
    if (count === 1) return { type: "all" };
    const targetType = Math.random();
    if (targetType < 0.33) return { type: "all" };
    if (targetType < 0.66) return { type: "some" };
    const max = Math.floor(Math.random() * (count - 1)) + 1;
    const min = Math.floor(Math.random() * max) + 1;
    return { type: "range", minimum: min, maximum: max };
  }

  // Adjust probabilities if isFixedLiar
  const adjustedProbs = isFixedLiar
    ? [clueTypeProbabilities[0], clueTypeProbabilities[1], clueTypeProbabilities[2], 0]
    : clueTypeProbabilities;

  const totalProb = adjustedProbs.reduce((sum, prob) => sum + prob, 0);
  const randomValue = Math.random() * totalProb;
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
      const randomColor = existingColors[Math.floor(Math.random() * existingColors.length)];
      const colorCount = existingBlobs.filter(blob => blob.color === randomColor).length;
      return clueColor(getRandomTarget(colorCount), randomColor, getRandomType());

    case 1: // Side clue
      const sidesWithBlobs = sides.filter(s => existingBlobs.some(blob => blob.side === s));
      if (sidesWithBlobs.length === 0) return clueAll(0);
      const randomSide = sidesWithBlobs[Math.floor(Math.random() * sidesWithBlobs.length)] as GroupSide;
      const sideCount = existingBlobs.filter(blob => blob.side === randomSide).length;
      return clueSide(getRandomTarget(sideCount), randomSide, getRandomType());

    case 2: // Specific clue
      const randomBlob = existingBlobs[Math.floor(Math.random() * existingBlobs.length)];
      return clueSpecific(randomBlob.name, getRandomType());

    case 3: // All clue
      return clueAll(Math.floor(Math.random() * (maxLiars - minLiars + 1)) + minLiars);

    default:
      return clueAll(0);
  }
}


// Main function to generate a random level
export function generateRandomLevel(blobDifficulty: Difficulty, liarDifficulty: Difficulty): Level {
  const blobCount = getBlobCount(blobDifficulty);
  const [minimumLiers, maximumLiers] = getLiarCountRange(liarDifficulty, blobCount);
  const distribution = getBlobDistribution(blobCount);

  const blobs: Blob[] = [];
  const colors = Object.values(col);
  const usedNames = new Set<string>();

  // Generate blobs with colors and sides
  Object.entries(distribution).forEach(([sideKey, count]) => {
    const currentSide = sideKey as GroupSide;
    for (let i = 0; i < count; i++) {
      let name;
      do {
        name = blobNamesPTBR[Math.floor(Math.random() * blobNamesPTBR.length)];
      } while (usedNames.has(name));
      usedNames.add(name);

      const color = colors[Math.floor(Math.random() * colors.length)] as BlobColor;
      blobs.push(newBlob(name, color, clueAll(0), currentSide));
    }
  });

  // Generate clues for each blob
  blobs.forEach(blob => {
    blob.clue = generateRandomClue(blobs, minimumLiers, maximumLiers, [8, 4, 2, 1]);
  });

  return {
    name: `Random Level (${blobCount} blobs, ${minimumLiers}-${maximumLiers} liars)`,
    minimumLiers,
    maximumLiers,
    blobs,
  };
}
