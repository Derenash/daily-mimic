import { blobColor, blobType as blobClassification, groupSide, blobType } from "../constants/index.js";
import { getBlobText } from "../text/clueToText.js";
import { blobMapFromList, count, getBlobType, getRealClueType, isStatementTrue, log, moveElementToStart } from "../utils/generalUtils.js";

export type GroupSide = typeof groupSide[keyof typeof groupSide];
export type BlobType = typeof blobClassification[keyof typeof blobClassification];
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

/**
 * Manages combinations of blob possibilities and their occurrences.
 */
class Combinations {
  // Maps possibility IDs to their corresponding blob type configurations
  possibilityMap: Map<number, Map<string, BlobType>>;
  // Tracks occurrences of blobs in truth and false states
  blobsOccurrences: Map<string, [truthIds: number[], falseIds: number[]]>;
  // Counter for generating unique possibility IDs
  nextPossibilityId: number;

  constructor() {
    this.possibilityMap = new Map();
    this.blobsOccurrences = new Map();
    this.nextPossibilityId = 0;
  }

  /**
   * Adds a new possibility to the combinations.
   * @param newPossibility A map of blob names to their types for this possibility
   */
  public addPossibility(newPossibility: Map<string, BlobType>) {
    this.updateBlobOccurrences(newPossibility, this.nextPossibilityId);
    this.possibilityMap.set(this.nextPossibilityId, newPossibility);
    this.nextPossibilityId++;
  }

  public static clone(original: Combinations): Combinations {
    const copy = new Combinations();

    // Deep copy possibilityMap
    copy.possibilityMap = new Map();
    for (const [id, possibility] of original.possibilityMap) {
      const possibilityCopy = new Map<string, BlobType>();
      for (const [blobName, blobType] of possibility) {
        possibilityCopy.set(blobName, blobType);
      }
      copy.possibilityMap.set(id, possibilityCopy);
    }

    // Deep copy blobsOccurrences
    copy.blobsOccurrences = new Map();
    for (const [blobName, [truthIds, falseIds]] of original.blobsOccurrences) {
      copy.blobsOccurrences.set(blobName, [
        [...truthIds],
        [...falseIds]
      ]);
    }

    // Copy nextPossibilityId
    copy.nextPossibilityId = original.nextPossibilityId;

    return copy;
  }

  public show(): string {
    let result = "Possibility Map:\n";
    for (const [id, possibility] of this.possibilityMap) {
      result += `ID: ${id}, Possibility: ${JSON.stringify(Array.from(possibility.entries()))}\n`;
    }

    result += "\nBlob Occurrences:\n";
    for (const [blobName, [trueOccurrences, falseOccurrences]] of this.blobsOccurrences) {
      result += `Blob: ${blobName}\n`;
      result += `  Truth occurrences: ${JSON.stringify(trueOccurrences)}\n`;
      result += `  False occurrences: ${JSON.stringify(falseOccurrences)}\n`;
    }

    return result;
  }

  /**
   * Updates the blobOccurrences map with a new possibility.
   * @param possibility The new possibility to add
   * @param possibilityId The ID of the new possibility
   */
  private updateBlobOccurrences(possibility: Map<string, BlobType>, possibilityId: number) {
    // Iterate through each entry in the possibility map
    for (const [blobName, blobType] of possibility) {
      // Get the current occurrences for the blob, or initialize if not present
      let occurrences = this.blobsOccurrences.get(blobName);
      if (!occurrences) {
        occurrences = [[], []];
      }

      // Determine which index to update based on the blob type
      let indexToUpdate: number;
      if (blobType === blobClassification.TRUTH) {
        indexToUpdate = 0;
      } else {
        indexToUpdate = 1;
      }

      // Add the possibility ID to the appropriate occurrence array
      occurrences[indexToUpdate].push(possibilityId);

      // Update the blobOccurrences map with the modified occurrences
      this.blobsOccurrences.set(blobName, occurrences);
    }
  }

}

type Hypotheses = Hypothesis[]


class Hypothesis {

  private minimumLiers: number;
  private maximumLiers: number;
  private prohibitedLiers: number[];
  public blobs: Map<string, BlobType>;
  public lierCount: number;
  public combinations: Combinations[];

  constructor(minimumLiers: number, maximumLiers: number, prohibitedLiers?: number[], blobs?: Map<string, BlobType>, lierCount?: number, combinations?: Combinations[]) {
    this.minimumLiers = minimumLiers
    this.maximumLiers = maximumLiers;
    this.prohibitedLiers = prohibitedLiers || [];
    this.blobs = blobs || new Map<string, BlobType>();
    this.lierCount = lierCount || 0;
    this.combinations = combinations || [];
  }

  public addNewClue(clue: Clue, blobType: BlobType, levelBlobs: Blob[]): boolean {
    console.log("adding new clue");
    let table: Combinations = new Combinations;
    if (clue.clueType === "specific") {
      return this.checkAndUpdateHypothesis(clue.blobName, getRealClueType(clue.blobType, blobType));
    }
    if (clue.clueType === "color") {
      const targetBlobs = [];
      for (const blob of levelBlobs) {
        if (blob.color === clue.color) {
          targetBlobs.push(blob.name);
        }
      }
      console.log(`calling: Color, generateByTarget with ${targetBlobs} ${JSON.stringify(clue.target)} ${clue.blobType} ${isStatementTrue(blobType)}`);
      table = this.generateByTarget(targetBlobs, clue.target, clue.blobType, isStatementTrue(blobType));
    }
    if (clue.clueType === "side") {
      const targetBlobs = [];
      for (const blob of levelBlobs) {
        if (blob.side === clue.side) {
          targetBlobs.push(blob.name);
        }
      }
      console.log(`calling: Side, generateByTarget with ${targetBlobs} ${JSON.stringify(clue.target)} ${clue.blobType} ${isStatementTrue(blobType)}`);
      table = this.generateByTarget(targetBlobs, clue.target, clue.blobType, isStatementTrue(blobType));
    }
    if (clue.clueType === "all") {
      if (blobType === blobClassification.TRUTH) {
        if (clue.amount >= this.minimumLiers && clue.amount <= this.maximumLiers) {
          this.minimumLiers = clue.amount;
          this.maximumLiers = clue.amount;
        } else {
          return false;
        }
      }
      if (blobType === blobClassification.LIE) {
        console.log(`we're prohiting ${clue.amount} liers, adding to ${this.prohibitedLiers}`);
        this.prohibitedLiers.push(clue.amount);
      }
      return true;
    }
    this.combinations.push(table);
    const isValid = this.validateCombination(table);
    return isValid;
  }

  private generateByTarget(blobs: string[], target: ClueTarget, blobType: BlobType, isLegit: boolean): Combinations {
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
    blobs.forEach((blob, index) => {
      const definedBlob = this.blobs.get(blob);
      if (definedBlob) {
        if (definedBlob === blobType) {
          minOdds--;
          maxOdds--;
        }
        console.log(`removing ${blob} from ${blobs}`);
      }
      else {
        newBlobs.unshift(blob);
      }
    })
    console.log(`Calling generateCombinations with ${newBlobs} ${minOdds} ${maxOdds} ${blobType} ${isLegit}`);
    return this.generateCombinations(newBlobs, minOdds, maxOdds, blobType, isLegit);

  }

  private validateCombination(combinations: Combinations): boolean {
    const possibilities = combinations.possibilityMap;
    if (possibilities.size === 1) {
      const blobs: Map<string, BlobType> = possibilities.values().next().value;
      console.log("possibilities\n" + combinations.show());
      blobs.forEach((blobType, blobName) => {
        const isValid = this.checkAndUpdateHypothesis(blobName, blobType);
        if (!isValid) {
          return false
        }
      })
      return true;
    }

    if (possibilities.size === 0) {
      console.log("No possible combinations");
      return false;
    }

    return true;
  }


  // Fer,Padre,Poopy 3 3 Legit false
  private generateCombinations(inputList: string[], minOdds: number, maxOdds: number, oddType: BlobType, isLegit: boolean): Combinations {

    const result: Combinations = new Combinations;

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

      const isWithinLierRange = liarCount <= this.maximumLiers;
      const isWithinOddRangeForCombination = oddCount >= minOdds && oddCount <= maxOdds;

      if (isWithinLierRange && (isWithinOddRangeForCombination == isLegit)) {
        result.addPossibility(currentCombination);
      }
    }

    console.log(`Generation complete. Total possibilities: ${result.possibilityMap.size}`);
    console.log(result.show());
    return result;
  }
  public checkAndUpdateHypothesis(blobName: string, blobType: BlobType): boolean {
    console.log("trying to add " + blobName + " as " + blobType);
    const existingClassification = this.blobs.get(blobName);
    if (existingClassification) {
      const isConsistent = existingClassification === blobType;
      if (!isConsistent) {
        console.log(`Cancel: ${blobName} is already classified as ${existingClassification}`);
      }
      return isConsistent;
    } else {
      this.blobs.set(blobName, blobType);
      if (blobType == blobClassification.LIE) {
        const isValid = this.tryIncrementLierCount();
        if (!isValid) {
          return false;
        }
      }
      const isValid = this.checkAndUpdateCombinations(blobName, blobType);
      if (!isValid) {
        return false;
      }
      console.log(`Add ${blobName} to hypothesis as ${blobType}`);
      return true;
    }
  }

  private checkAndUpdateCombinations(blobName: string, blobType: BlobType): boolean {
    console.log(`Checking combinations for ${blobName} as ${blobType}`);
    this.combinations.forEach((combination, index) => {
      const blobOccurances = combination.blobsOccurrences.get(blobName);
      if (blobOccurances) {
        const indexToRemove = (blobType === blobClassification.LIE) ? 0 : 1;
        const indexToStay = (blobType === blobClassification.LIE) ? 1 : 0;

        const invalidPossibilities = blobOccurances[indexToRemove];

        invalidPossibilities.forEach(id => {
          const possibilityToRemove = combination.possibilityMap.get(id);
          if (possibilityToRemove) {
            combination.blobsOccurrences.delete(blobName);
            const isValid = this.removePossibilityFromOccurrences(combination, id);
            if (!isValid) {
              return false
            }
          }
        })

        const isValid = this.validateCombination(combination);
        return isValid;
      }
    })
    return true;
  }

  private removePossibilityFromOccurrences(combinations: Combinations, id: number): boolean {
    combinations.possibilityMap.delete(id);
    combinations.blobsOccurrences.forEach((blobOccurrences, blobName) => {
      blobOccurrences.forEach((occurrences, index) => {
        const blobRemainingType = (index === 0) ? blobClassification.LIE : blobClassification.TRUTH;
        occurrences.filter(occurrenceId => occurrenceId !== id);
        if (occurrences.length === 0) {
          const isValid = this.checkAndUpdateHypothesis(blobName, blobRemainingType);
          if (!isValid) {
            return false;
          }
        }
      })
    })
    return true;
  }

  private tryIncrementLierCount(): boolean {
    if (this.lierCount < this.maximumLiers) {
      this.lierCount++;
      return true;
    }
    console.log("Cancel: Maximum liers reached");
    return false;
  }

  public checkForSolution(): boolean {
    const isWithinLierRange = this.lierCount >= this.minimumLiers && this.lierCount <= this.maximumLiers;
    const isProhibited = this.prohibitedLiers.includes(this.lierCount);
    console.log("Prohibited:" + this.prohibitedLiers);
    if (isWithinLierRange && !isProhibited) {
      console.log("Solution found!");
      console.log(`Solution: ${JSON.stringify([...this.blobs], null, 2)}`);
      console.log(`Hypothesis: ${JSON.stringify(this.combinations, null, 2)}`);
      console.log(`Lier count: ${this.lierCount}`);

      return true;
    }
    console.log("No solution found.");
    return false;
  }

  // this.minimumLiers = minimumLiers
  // this.maximumLiers = maximumLiers;
  // this.prohibitedLiers = prohibitedLiers || [];
  // this.blobs = blobs || new Map<string, BlobType>();
  // this.lierCount = lierCount || 0;
  // this.combinations = combinations || [];

  public clone(): Hypothesis {
    const newHypothesis = new Hypothesis(this.minimumLiers, this.maximumLiers);
    // Deep copy of blobs
    const newBlobs = new Map();
    this.blobs.forEach((value, key) => {
      newBlobs.set(key, value);
    })
    newHypothesis.blobs = newBlobs;
    // Deep copy of combinations
    newHypothesis.combinations = this.combinations.map(combination => Combinations.clone(combination));
    // Deep copy of liercount
    newHypothesis.lierCount = this.lierCount;
    newHypothesis.prohibitedLiers = [...this.prohibitedLiers];

    return newHypothesis;
  }

}

type History = Map<string, BlobType>

export function levelSolver(level: Level): Hypotheses {
  const hypothesis: Hypothesis = new Hypothesis(level.minimumLiers, level.maximumLiers);
  const blobsMap = blobMapFromList(level.blobs);

  // Initialize an empty history map to track seen blobs
  const history: History = new Map;

  // Create an array of blob names to use as the next steps
  const nextSteps = [...level.blobs.map(blob => blob.name)];

  const solutions = splitSteps(hypothesis, history, nextSteps, blobsMap);
  return solutions;
}

// Creates 2 new hypotheses, one with the current blob as a liar and one with the current blob as a truth teller
function splitSteps(
  hypothesis: Hypothesis,
  history: History,
  nextTargets: string[],
  blobsMap: Map<string, Blob>
): Hypotheses {
  count();
  const nextTarget = nextTargets.pop();
  // If there is no next target and the hypothesis hasn`t been proved wrong, return the hypothesis as a solution
  if (!nextTarget) {
    const isSolution = hypothesis.checkForSolution();
    if (isSolution) {
      return [hypothesis]
    }
    return [];
  }
  // All maps are duplicated to ensure that each hypothesis path is independent of the other
  const lieHypothesis = hypothesis.clone();
  const lieSeenBlobs = new Map(history);
  const lieNextTargets = [...nextTargets];

  // Tests the Hypothesis of nextTarget being a liar
  const correctLieHypothesis = runStep(lieHypothesis, lieSeenBlobs, nextTarget, blobClassification.LIE, lieNextTargets, blobsMap);

  // Tests the Hypothesis of nextTarget being a truth teller
  const correctTruthHypothesis = runStep(hypothesis, history, nextTarget, blobClassification.TRUTH, nextTargets, blobsMap);

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
  const blob = blobsMap.get(blobName);
  if (!blob) {
    throw new Error("Blob not found");
  }
  // runs next Step, and checks if the hypothesis is still valid
  const isValid = step(hypothesis, history, blob, testType, nextBlobs, blobsMap);

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
  nextSteps: string[],
  blobsMap: Map<string, Blob>
): boolean {
  console.log(`Next Step!`);
  console.log(`Hypothesis: \n${JSON.stringify([...hypothesis.blobs], null, 2)}`);
  console.log(`History: \n${JSON.stringify([...history], null, 2)}`);
  hypothesis.combinations.forEach((combination, index) => {
    console.log(`Combination ${index}: \n${combination.show()}`);
  })
  console.log(`Testing: ${blob.name} being ${testType}`);
  // If blob is not in the history, add it
  history.set(blob.name, testType);

  const testHypothesisResult = hypothesis.checkAndUpdateHypothesis(blob.name, testType);
  if (!testHypothesisResult) {
    console.log(`this shit just got invalidated`);
    return false;
  }

  const isValid = hypothesis.addNewClue(blob.clue, testType, Array.from(blobsMap.values()));
  return isValid;
}


// Vou organizar todas as possibilidades possiveis dada uma dica, por exemplo
//   Dica: 2 Vermelhos são falsos
//   Pedro, Joao, Maria são vermelhos
//   as combinações possíveis de falsos são:
//   Pedro Joao
//   Pedro Maria
//   Joao  Maria

// Com isso, no momento que eu receber uma nova hipotese que tem qualquer relação com esses
//   eu vou poder eliminar algumas opçoes, e obter todas hipoteses como resultado

// Por exemplo, se eu estiver testando que Pedro é true, 
//   eu automaticamente vou conseguir eliminar os 2 casos:
//   Pedro Joao  fakes
//   Pedro Maria fakes

// E então vou saber a classificação de Pedro João e Maria


log("sexo")