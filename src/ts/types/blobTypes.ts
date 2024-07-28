import { blobColor, blobType, groupSide } from "../constants/index.js";
import { blobMapFromList, moveElementToStart } from "../utils/generalUtils.js";

export type GroupSide = typeof groupSide[keyof typeof groupSide];
export type BlobType = typeof blobType[keyof typeof blobType];
export type BlobColor = typeof blobColor[keyof typeof blobColor];

export interface BlobTypeStyle {
  color: string;
  fontWeight: number;
}

export interface Level {
  name: string;
  minimumLiers: number;
  maximumLiers: number;
  liersAmount: number;
  blobs: Blob[];
}

export interface Blob {
  name: string;
  color: BlobColor;
  clue: Clue;
  side?: GroupSide;
}

export type Clue = ColorClue | SideClue | SpecificClue | AllClue;

export interface ColorClue {
  clueType: "color";
  color: BlobColor;
  target: ClueTarget;
  blobType: BlobType;
}

export interface SideClue {
  clueType: "side";
  side: GroupSide;
  target: ClueTarget;
  blobType: BlobType;
}

export interface SpecificClue {
  clueType: "specific";
  blobName: string;
  blobType: BlobType;
}

export interface AllClue {
  clueType: "all";
  amount: number;
  blobType: BlobType;
}


export type ClueTarget = ClueTargetAll | ClueTargetSome | ClueTargetRange;

export interface ClueTargetAll {
  type: "all";
}

export interface ClueTargetSome {
  type: "some";
}

export interface ClueTargetRange {
  type: "range";
  minimum: number;
  maximum: number;
}

// type Solution = Map<string, BlobType>

// const solution: Solution = new Map<string, BlobType>([
//   ["Bob", blobType.TRUTH],
//   ["Leozin", blobType.TRUTH],
//   ["Bielzinho", blobType.LIE],
//   ["Jaiminho", blobType.TRUTH]
// ]);

type Hypotheses = Hypothesis[]
type Hypothesis = Map<string, BlobType>
type History = Map<string, BlobType>

export function levelSolver(level: Level): Hypotheses {
  const hypothesis: Hypothesis = new Map;
  const blobsMap = blobMapFromList(level.blobs);

  // Initialize an empty history map to track seen blobs
  const history: History = new Map;

  // Create an array of blob names to use as the next steps
  const nextSteps = [...level.blobs.map(blob => blob.name)];

  const solutions = splitSteps(hypothesis, history, nextSteps, blobsMap);
  return solutions;
}

// Creates 2 new hypotheses, one with the current blob as a liar and one with the current blob as a truth teller
function splitSteps(hypothesis: Hypothesis, history: History, nextTargets: string[], blobsMap: Map<string, Blob>): Hypotheses {
  const nextTarget = nextTargets.pop();
  // If there is no next target and the hypothesis hasn`t been proved wrong, return the hypothesis as a solution
  if (!nextTarget) {
    console.log("Solution found!");
    console.log(`Solution: ${JSON.stringify([...hypothesis], null, 2)}`);
    return [hypothesis];
  }
  // All maps are duplicated to ensure that each hypothesis path is independent of the other
  const lieHypothesis = new Map(hypothesis);
  const lieSeenBlobs = new Map(history);
  const lieNextTargets = [...nextTargets];

  // Tests the Hypothesis of nextTarget being a liar
  const correctLieHypothesis = runStep(lieHypothesis, lieSeenBlobs, nextTarget, blobType.LIE, lieNextTargets, blobsMap);

  // Tests the Hypothesis of nextTarget being a truth teller
  const correctTruthHypothesis = runStep(hypothesis, history, nextTarget, blobType.TRUTH, nextTargets, blobsMap);

  // Returns all the solutions found on the 2 paths
  return [...correctLieHypothesis, ...correctTruthHypothesis];
}

function runStep(
  hypothesis: Hypothesis,
  history: History,
  blobName: string,
  testType: BlobType,
  nextBlobs: string[],
  blobsMap: Map<string, Blob>
): Hypotheses {

  console.log(`Next Step!`);
  console.log(`Hypothesis: \n${JSON.stringify([...hypothesis], null, 2)}`);
  console.log(`History: \n${JSON.stringify([...history], null, 2)}`);
  console.log(`Testing: ${blobName} is ${testType}`);

  const blob = blobsMap.get(blobName);
  if (!blob) {
    throw new Error("Blob not found");
  }
  // runs next Step, and checks if the hypothesis is still valid
  const isValid = step(hypothesis, history, blob, testType, nextBlobs);

  // If the hypothesis is not valid, return an empty array
  if (!isValid) {
    return [];
  } else {
    // If the hypothesis is valid, continue by checking all possibilities
    return splitSteps(hypothesis, history, nextBlobs, blobsMap);
  }
}

function step(
  hypothesis: Hypothesis,
  history: History,
  blob: Blob,
  testType: BlobType,
  nextSteps: string[]
): boolean {
  console.log(`Next Step!`);
  console.log(`Hypothesis: \n${JSON.stringify([...hypothesis], null, 2)}`);
  console.log(`History: \n${JSON.stringify([...history], null, 2)}`);
  console.log(`Testing: ${blob.name} is ${testType}`);
  // If blob is not in the history, add it
  history.set(blob.name, testType);

  // Test if the target's testing type coincides with current hypothesis
  const testHypothesisResult = testHypothesis(hypothesis, blob.name, testType);
  if (!testHypothesisResult) {
    console.log(`Cancel: test of ${blob.name} being ${testType} \nCurrent hypothesis say it is ${hypothesis.get(blob.name)}`);
    return false;
  }

  // Tests if the current clue can be valid with the current hypothesis
  // If it is valid, the hypothesis is updated with all the new information provided by the clue
  const clue = blob.clue;
  if (clue.clueType === "specific") {
    return testSpecificClue(hypothesis, clue, testType, nextSteps);
  }

  return true;
}

function testSpecificClue(
  hypothesis: Hypothesis,
  clue: SpecificClue,
  testType: BlobType,
  nextSteps: string[]
): boolean {

  // The clue's real type is dependent of the clue teller's type
  //
  //        Clue
  //     | T | L |
  //      
  //     | T | L |  | T | <- clue teller is real  
  //     | L | T |  | L | <- clue teller is fake
  //

  let accusationType: BlobType;
  if (testType === blobType.TRUTH) {
    if (clue.blobType === blobType.TRUTH) {
      accusationType = blobType.TRUTH
    } else {
      accusationType = blobType.LIE
    }
  } else {
    if (clue.blobType === blobType.TRUTH) {
      accusationType = blobType.LIE
    } else {
      accusationType = blobType.TRUTH
    }
  }

  // Test if the clue's target Blob coincides with current hypothesis
  const specificClueTest = testHypothesis(hypothesis, clue.blobName, accusationType);
  if (!specificClueTest) {
    console.log(`Cancel: assumption that ${clue.blobName} is ${accusationType} \nCurrent hypothesis say it is ${hypothesis.get(clue.blobName)}`)
    return false;
  }

  // If the hypothesis is valid, move the clue's target to the start of the next steps
  moveElementToStart(nextSteps, clue.blobName);
  return true;
}

// Test if a given blob's type, checking if it has the same type as it has in the hypothesis
//   if it does not exists in the hypothesis, it is added
//   if it exists and is different, the hypothesis is invalid
//   if it exists and is the same, the hypothesis remains valid
function testHypothesis(hypothesis: Hypothesis, targetName: string, blobType: BlobType): boolean {
  const testType = hypothesis.get(targetName);
  if (testType) {
    const isSafe = testType === blobType;
    return isSafe;
  } else {
    hypothesis.set(targetName, blobType);
    console.log(`Add ${targetName} to hypothesis as ${blobType}`);
    return true;
  }
}
