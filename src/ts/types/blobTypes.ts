import { blobColor, blobType, groupSide } from "../constants/index.js";

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
enum Instruction {
  SKIP,
  CANCEL,
  CONTINUE
}

export function levelSolver(level: Level): Hypotheses {
  const blobs = level.blobs;
  const hypothesis: Hypothesis = new Map;
  const seenBlobs: History = new Map;
  const blobsMap = new Map<string, Blob>(level.blobs.map(blob => [blob.name, blob]));
  const nextSteps = [...blobs.map(blob => blob.name)];
  const blob = blobs[0];
  // Test True and Lie for first blob
  const truthHypothesis = new Map(hypothesis);
  const truthSeenBlobs = new Map(seenBlobs);
  const truthNextSteps = [...nextSteps];
  nextStep(truthHypothesis, truthSeenBlobs, blobType.TRUTH, truthNextSteps, blobsMap);
  nextStep(hypothesis, seenBlobs, blobType.LIE, nextSteps, blobsMap);
  return [hypothesis, truthHypothesis];
}

function nextStep(hypothesis: Hypothesis, history: History, targetHypothesis: BlobType, nextSteps: string[], blobs: Map<string, Blob>): Hypotheses {
  const currentStep = nextSteps.pop();
  if (!currentStep) {
    console.log("No more steps");
    console.log(`Hypothesis: \n${JSON.stringify([...hypothesis], null, 2)}`);
    return [hypothesis];
  }
  if (!history.has(currentStep)) {
    console.log(``);
    console.log(`Next Step!`);
    console.log(`Hypothesis: \n${JSON.stringify([...hypothesis], null, 2)}`);
    console.log(`History: \n${JSON.stringify([...history], null, 2)}`);
    console.log(`Testing the hypothesis: ${currentStep} is ${targetHypothesis}`);
  }
  const targetBlob = blobs.get(currentStep);
  if (!targetBlob) {
    throw new Error("Blob not found");
  }
  const stepResult = step(hypothesis, history, targetBlob, targetHypothesis, nextSteps);
  if (stepResult === Instruction.SKIP) {
    const correctNextHypothesis = nextStep(hypothesis, history, targetHypothesis, nextSteps, blobs);
    return correctNextHypothesis;
  }
  if (stepResult === Instruction.CANCEL) {
    return [];
  }
  if (stepResult === Instruction.CONTINUE) {
    // Recreate all fields for truth and lie
    const lieHypothesis = new Map(hypothesis);
    const lieSeenBlobs = new Map(history);
    const lieNextSteps = [...nextSteps];
    const correctLieHypothesis = nextStep(lieHypothesis, lieSeenBlobs, blobType.LIE, lieNextSteps, blobs);
    const correctTruthHypothesis = nextStep(hypothesis, history, blobType.TRUTH, nextSteps, blobs);
    return [...correctLieHypothesis, ...correctTruthHypothesis];
  }
  throw new Error(`Unexpected step result: ${stepResult}`);
}

function step(hypothesis: Hypothesis, history: History, target: Blob, targetHypothesis: BlobType, nextSteps: string[]): Instruction {
  // If blob is already in the history, skip
  if (history.has(target.name)) {
    // console.log(target.name, "already seen")
    return Instruction.SKIP;
  }
  // If blob is not in the history, add it
  history.set(target.name, targetHypothesis);

  // Get status for Blob in the memory
  const testHypothesisResult = testHypothesis(hypothesis, target.name, targetHypothesis);
  if (!testHypothesisResult) {
    console.log(`CANCELING the possibility \nhypothesis say: ${target.name} is ${hypothesis.get(target.name)} \nbut we're testing if ${target.name} is ${targetHypothesis}`)
    return Instruction.CANCEL;
  }

  const clue = target.clue;
  if (clue.clueType === "specific") {
    const shouldBeTrue = targetHypothesis == clue.blobType;
    const accusationType = shouldBeTrue ? blobType.TRUTH : blobType.LIE;

    const specificClueTest = testHypothesis(hypothesis, clue.blobName, accusationType);
    if (!specificClueTest) {
      console.log(`CANCELING by the assumption \nhypothesis say: ${clue.blobName} is ${hypothesis.get(clue.blobName)} \nbut we're testing if ${clue.blobName} is ${accusationType}`)
      return Instruction.CANCEL;
    }
    nextSteps.push(clue.blobName);
  }

  return Instruction.CONTINUE

}

function testHypothesis(history: Hypothesis, targetName: string, blobType: BlobType): boolean {
  const targetInMemory = history.get(targetName);
  if (targetInMemory) {
    const isSafe = targetInMemory === blobType;
    return isSafe;
  } else {
    history.set(targetName, blobType);
    console.log(`Adding ${targetName} to hypothesis as ${blobType}`);
    return true;
  }
}

