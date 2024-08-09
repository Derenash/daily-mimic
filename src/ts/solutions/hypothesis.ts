import { Blob, BlobType, Clue, ClueTarget } from "../types/index.js";
import { getRealClueType, isStatementTrue, log } from "../utils/index.js";
import PossibilityCombinations from "./possibilityCombinations.js";
import { blobType as blobClassification } from "../constants/index.js";

class Hypothesis {

  private minLiars: number;
  private maxLiars: number;
  private disallowedLiarCounts: number[];
  public blobsClassifications: Map<string, BlobType>;
  public currentLiarCount: number;
  public possibleCombinations: PossibilityCombinations[];

  constructor(minimumLiers: number, maximumLiers: number) {
    this.minLiars = minimumLiers
    this.maxLiars = maximumLiers;
    this.disallowedLiarCounts = [];
    this.blobsClassifications = new Map<string, BlobType>();
    this.currentLiarCount = 0;
    this.possibleCombinations = [];
  }

  public clone(): Hypothesis {
    const newHypothesis = new Hypothesis(this.minLiars, this.maxLiars);
    const newBlobs = new Map();
    this.blobsClassifications.forEach((value, key) => {
      newBlobs.set(key, value);
    })
    newHypothesis.blobsClassifications = newBlobs;
    newHypothesis.possibleCombinations = this.possibleCombinations.map(combination => combination.clone());
    newHypothesis.currentLiarCount = this.currentLiarCount;
    newHypothesis.disallowedLiarCounts = [...this.disallowedLiarCounts];

    return newHypothesis;
  }

  public processNewClue(clue: Clue, blobType: BlobType, levelBlobs: Blob[]): void {
    console.log(`trying to add new clue: ${JSON.stringify(clue)}`);
    try {
      if (clue.clueType === "specific") {
        this.processNewBlobDefinition(clue.blobName, getRealClueType(clue.blobType, blobType));
      }
      if (clue.clueType === "color") {
        const targetBlobs = [];
        for (const blob of levelBlobs) {
          if (blob.color === clue.color) {
            targetBlobs.push(blob.name);
          }
        }
        const possibilityTable = this.generatePossibilityCombinationsByTarget(targetBlobs, clue.target, clue.blobType, isStatementTrue(blobType));
        this.validateNewPossibilityTable(possibilityTable);
      }
      if (clue.clueType === "side") {
        const targetBlobs = [];
        for (const blob of levelBlobs) {
          if (blob.side === clue.side) {
            targetBlobs.push(blob.name);
          }
        }
        const possibilityTable = this.generatePossibilityCombinationsByTarget(targetBlobs, clue.target, clue.blobType, isStatementTrue(blobType));
        this.validateNewPossibilityTable(possibilityTable);
      }
      if (clue.clueType === "all") {
        if (blobType === blobClassification.TRUTH) {
          if (clue.amount >= this.minLiars && clue.amount <= this.maxLiars) {
            this.minLiars = clue.amount;
            this.maxLiars = clue.amount;
          } else {
            throw new Error(`liar aount ${clue.amount} is not within the range of ${this.minLiars} and ${this.maxLiars}`);
          }
        }
        if (blobType === blobClassification.LIE) {
          console.log(`We're prohiting ${clue.amount} liar, adding to ${this.disallowedLiarCounts}`);
          this.disallowedLiarCounts.push(clue.amount);
        }
      }
    } catch (error: any) {
      throw new Error(`Error processing new clue: ${error.message}`);
    }
  }

  public processNewBlobDefinition(blobName: string, blobType: BlobType): void {
    console.log("trying to add " + blobName + " as " + blobType);
    const existingClassification = this.blobsClassifications.get(blobName);
    try {
      if (existingClassification) {
        this.validateClassification(blobName, existingClassification, blobType);
      } else {
        this.blobsClassifications.set(blobName, blobType);

        if (blobType == blobClassification.LIE) {
          this.tryIncrementLiarCount();
        }

        // 1. Remove the blob from all combinations where it is not the blobType
        //
        this.processNewBlobTypeInCombinations(blobName, blobType);

        console.log(`Successfully added ${blobName} as ${blobType} to the hypothesis`);
      }
    } catch (error: any) {
      throw new Error(`Failed to add ${blobName} as ${blobType} to the hypothesis: ${error.message}`);
    }
  }

  public validateSolution(): void {
    const isLiarCountValid = this.currentLiarCount >= this.minLiars && this.currentLiarCount <= this.maxLiars;
    const isLiarCountProhibited = this.disallowedLiarCounts.includes(this.currentLiarCount);

    if (isLiarCountProhibited) {
      throw new Error("Prohibited liar count");
    }
    if (!isLiarCountValid) {
      throw new Error("Liar count out of range");
    }

    console.log("Solution found!");
    console.log(`Solution: ${JSON.stringify([...this.blobsClassifications], null, 2)}`);
    console.log(`Hypothesis: ${JSON.stringify(this.possibleCombinations, null, 2)}`);
    console.log(`Liar count: ${this.currentLiarCount}`);
    return;
  }

  private generatePossibilityCombinations(inputList: string[], minOdds: number, maxOdds: number, oddType: BlobType, isLegit: boolean): PossibilityCombinations {

    const result: PossibilityCombinations = new PossibilityCombinations;

    const totalCombinations = Math.pow(2, inputList.length);


    for (let combinationIndex = 0; combinationIndex < totalCombinations; combinationIndex++) {

      const currentCombination = new Map<string, BlobType>();
      let liarCount = 0;
      let oddCount = 0;

      for (let itemIndex = 0; itemIndex < inputList.length; itemIndex++) {
        const currentItem = inputList[itemIndex];

        const isTruthTeller = ((combinationIndex >> itemIndex) & 1) === 1;
        const isOddType = isTruthTeller ? oddType === blobClassification.TRUTH : oddType === blobClassification.LIE;
        const blobType = isTruthTeller ? blobClassification.TRUTH : blobClassification.LIE;

        currentCombination.set(currentItem, blobType);

        if (!isTruthTeller) {
          liarCount++;
        }
        if (isOddType) {
          oddCount++;
        }
      }

      const isWithinLierRange = liarCount <= this.maxLiars;
      const isWithinOddRangeForCombination = oddCount >= minOdds && oddCount <= maxOdds;

      if (isWithinLierRange && (isWithinOddRangeForCombination == isLegit)) {
        result.addPossibility(currentCombination);
      }
    }

    log(`Generation complete. Total possibilities: ${result.blobConfigurationMap.size}`);
    log(result.show());
    return result;
  }

  private generatePossibilityCombinationsByTarget(blobs: string[], target: ClueTarget, blobType: BlobType, isLegit: boolean): PossibilityCombinations {
    let minOdds: number = 0;
    let maxOdds: number = 0;
    if (target.type === "all") {
      minOdds = blobs.length;
      maxOdds = blobs.length;
    }
    if (target.type === "some") {
      minOdds = 1;
      maxOdds = blobs.length;
    }
    if (target.type === "range") {
      minOdds = target.minimum;
      maxOdds = target.maximum;
    }
    const newBlobs: string[] = [];
    blobs.forEach((blob) => {
      const definedBlob = this.blobsClassifications.get(blob);
      if (definedBlob) {
        if (definedBlob === blobType) {
          minOdds--;
          maxOdds--;
        }
      }
      else {
        newBlobs.unshift(blob);
      }
    })
    return this.generatePossibilityCombinations(newBlobs, minOdds, maxOdds, blobType, isLegit);

  }

  private validateCombination(combinations: PossibilityCombinations): void {
    try {
      const possibilities = combinations.blobConfigurationMap;
      if (possibilities.size === 1) {
        const blobs: Map<string, BlobType> = possibilities.values().next().value;
        blobs.forEach((blobType, blobName) => {
          this.processNewBlobDefinition(blobName, blobType);
        })
      }

      if (possibilities.size === 0) {
        throw new Error("No possible combinations");
      }

    } catch {
      throw new Error("Error validating combination");
    }
  }

  private processNewBlobTypeInCombinations(blobName: string, blobType: BlobType): void {
    console.log(`Checking combinations for ${blobName} as ${blobType}`);
    try {
      this.possibleCombinations.forEach((combination) => {
        const blobOccurances = combination.blobTruthFalseOccurrences.get(blobName);
        if (blobOccurances) {
          const indexToRemove = (blobType === blobClassification.LIE) ? 0 : 1;

          const invalidPossibilities = blobOccurances[indexToRemove];

          invalidPossibilities.forEach(id => {
            const possibilityToRemove = combination.blobConfigurationMap.get(id);
            if (possibilityToRemove) {
              combination.blobTruthFalseOccurrences.delete(blobName);
              this.removePossibilityFromOccurrences(combination, id);
            }
          })
          this.validateCombination(combination);
        }
      })
    } catch (error: any) {
      throw new Error(`Error processing ${blobName} as ${blobType}: ${error.message}`);
    }

  }

  // try to remove a possibility from the combination
  private removePossibilityFromOccurrences(combinations: PossibilityCombinations, idToRemove: number): void {
    try {
      // Remove the possibility from the configuration map
      combinations.blobConfigurationMap.delete(idToRemove);

      // Iterate through each blob's occurrences
      combinations.blobTruthFalseOccurrences.forEach((occurrences, blobName) => {
        const [truthOccurrences, lieOccurrences] = occurrences;

        // Remove the idToRemove from both truth and lie occurrences
        const updatedTruthOccurrences = this.removeIdFromOccurrences(truthOccurrences, idToRemove);
        const updatedLieOccurrences = this.removeIdFromOccurrences(lieOccurrences, idToRemove);

        // Update the occurrences for this blob
        combinations.blobTruthFalseOccurrences.set(blobName, [updatedTruthOccurrences, updatedLieOccurrences]);

        // If one of the occurrence lists is now empty, update the blob's classification
        this.updateBlobClassificationIfNeeded(blobName, updatedTruthOccurrences, updatedLieOccurrences);
      });
    } catch (error: any) {
      throw new Error(`Error removing possibility ${idToRemove} from occurrences: ${error.message}`);
    }
  }

  // try to increase liar count
  private tryIncrementLiarCount() {
    if (this.currentLiarCount < this.maxLiars) {
      this.currentLiarCount++;
      return true;
    }
    throw new Error(`Already reached max liars: ${this.maxLiars}`);
  }

  // Auxiliary functions

  private updateBlobClassificationIfNeeded(blobName: string, truthOccurrences: number[], lieOccurrences: number[]): void {
    if (truthOccurrences.length === 0 && lieOccurrences.length > 0) {
      this.processNewBlobDefinition(blobName, blobClassification.LIE);
    } else if (lieOccurrences.length === 0 && truthOccurrences.length > 0) {
      this.processNewBlobDefinition(blobName, blobClassification.TRUTH);
    }
  }

  private removeIdFromOccurrences(occurrences: number[], idToRemove: number): number[] {
    return occurrences.filter(id => id !== idToRemove);
  }

  private validateClassification(blobName: string, blobTypeA: BlobType, blobTypeB: BlobType): void {
    if (blobTypeA !== blobTypeB) {
      throw new Error(`Cancel: ${blobName} is already classified as ${blobTypeA}`);
    }
  }

  private validateNewPossibilityTable(possibilityTable: PossibilityCombinations): void {
    this.possibleCombinations.push(possibilityTable);
    this.validateCombination(possibilityTable);
  }

}

export default Hypothesis;