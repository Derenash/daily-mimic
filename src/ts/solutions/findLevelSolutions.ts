import { Blob, BlobType, Level, History } from "../types/index.js";
import { addToLocalCount, blobMapFromList, log } from "../utils/index.js";
import Hypothesis from "./hypothesis.js";
import { blobType as blobClassification } from "../constants/index.js";

export class LevelSolver {
  private level: Level;
  private blobsMap: Map<string, Blob>;

  constructor(level: Level) {
    this.level = level;
    this.blobsMap = blobMapFromList(level.blobs);
  }

  public findSolutions(): Hypothesis[] {
    const hypothesis = new Hypothesis(this.level.minimumLiers, this.level.maximumLiers);
    const history: History = new Map();
    const nextSteps = [...this.level.blobs.map(blob => blob.name)];

    return this.exploreThe2HypothesisBranches(hypothesis, history, nextSteps);
  }

  private exploreThe2HypothesisBranches(
    currentHypothesis: Hypothesis,
    exploredBlobs: History,
    remainingBlobs: string[]
  ): Hypothesis[] {
    const currentBlob = remainingBlobs.pop();

    if (!currentBlob) {
      try {
        currentHypothesis.validateSolution();
        return [currentHypothesis];
      } catch (error: any) {
        addToLocalCount();
        console.log(error.message);
        return [];
      }
    }

    const liarHypothesis = currentHypothesis.clone();
    const liarExploredBlobs = new Map(exploredBlobs);
    const liarRemainingBlobs = [...remainingBlobs];

    const liarSolutions = this.testHypothesisPath(liarHypothesis, liarExploredBlobs, currentBlob, blobClassification.LIE, liarRemainingBlobs);
    const truthSolutions = this.testHypothesisPath(currentHypothesis, exploredBlobs, currentBlob, blobClassification.TRUTH, remainingBlobs);

    return [...liarSolutions, ...truthSolutions];
  }

  private testHypothesisPath(
    hypothesis: Hypothesis,
    history: History,
    blobName: string,
    testType: BlobType,
    nextBlobs: string[]
  ): Hypothesis[] {
    const blob = this.blobsMap.get(blobName);
    if (!blob) {
      throw new Error("Blob not found");
    }

    try {
      this.processBlobHypothesis(hypothesis, history, blob, testType);
      return this.exploreThe2HypothesisBranches(hypothesis, history, nextBlobs);
    } catch (error: any) {
      addToLocalCount();
      console.log(error.message);
      return [];
    }
  }

  private processBlobHypothesis(
    hypothesis: Hypothesis,
    history: History,
    blob: Blob,
    testType: BlobType
  ): void {
    console.log(`Next Step!`);
    log(`Hypothesis: \n${JSON.stringify([...hypothesis.blobsClassifications], null, 2)}`);
    log(`History: \n${JSON.stringify([...history], null, 2)}`);
    hypothesis.possibleCombinations.forEach((combination, index) => {
      log(`Combination ${index}: \n${combination.show()}`);
    })
    console.log(`Testing: ${blob.name} being ${testType}`);

    history.set(blob.name, testType);

    try {
      hypothesis.processNewBlobDefinition(blob.name, testType);
      hypothesis.processNewClue(blob.clue, testType, Array.from(this.blobsMap.values()));
    } catch (error: any) {
      throw new Error(`Invalid hypothesis: \n${error.message}`);
    }
  }
}

// Usage
export function findLevelSolutions(level: Level): Hypothesis[] {
  const solver = new LevelSolver(level);
  return solver.findSolutions();
}
