import { BlobType } from "../types/index.js";
import { blobType as blobClassification } from "../constants/index.js";

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

/**
 * PossibilityCombinations Class
 * 
 * This class is designed to manage and analyze combinations of possibilities
 * based on given clues in a logic puzzle scenario. It's particularly useful
 * for puzzles where you need to deduce the truth values of multiple statements
 * or classify entities based on partial information.
 * 
 * Key Features:
 * 1. Stores and manages multiple possible configurations of blob (entity) types.
 * 2. Tracks occurrences of blobs in true and false states across all possibilities.
 * 3. Allows for easy addition of new possibilities and efficient querying of existing ones.
 * 
 * Use Case Example:
 * Consider a puzzle where you're given a clue: "2 Red ones are false"
 * And you know that Pedro, Joao, and Maria are red.
 * 
 * This class can help manage the possible combinations:
 * - Pedro and Joao are false
 * - Pedro and Maria are false
 * - Joao and Maria are false
 * 
 * As you receive more information or test hypotheses, you can quickly eliminate
 * incompatible possibilities. For instance, if you later determine that Pedro
 * is true, you can immediately eliminate the first two possibilities, leaving
 * only the third as valid.
 * 
 * The class provides methods to:
 * - Add new possibilities
 * - Clone the current state for branching scenarios
 * - Display the current state of all possibilities and blob occurrences
 * 
 * This structure allows for efficient narrowing down of possibilities as more
 * information becomes available, making it an excellent tool for solving
 * complex logic puzzles or deduction games.
 */

class PossibilityCombinations {
  // Maps possibility IDs to their corresponding blob type configurations
  public blobConfigurationMap: Map<number, Map<string, BlobType>>;
  // Tracks occurrences of blobs in truth and false states
  public blobTruthFalseOccurrences: Map<string, [truthIds: number[], falseIds: number[]]>;
  // Counter for generating unique possibility IDs
  private possibilityIdCounter: number;

  constructor() {
    this.blobConfigurationMap = new Map();
    this.blobTruthFalseOccurrences = new Map();
    this.possibilityIdCounter = 0;
  }

  public addPossibility(newPossibility: Map<string, BlobType>): void {
    this.updateBlobOccurrences(newPossibility, this.possibilityIdCounter);
    this.blobConfigurationMap.set(this.possibilityIdCounter, newPossibility);
    this.possibilityIdCounter++;
  }

  public clone(): PossibilityCombinations {
    const copy = new PossibilityCombinations();

    // Deep copy possibilityMap
    copy.blobConfigurationMap = new Map();
    for (const [id, possibility] of this.blobConfigurationMap) {
      const possibilityCopy = new Map<string, BlobType>();
      for (const [blobName, blobType] of possibility) {
        possibilityCopy.set(blobName, blobType);
      }
      copy.blobConfigurationMap.set(id, possibilityCopy);
    }

    // Deep copy blobsOccurrences
    copy.blobTruthFalseOccurrences = new Map();
    for (const [blobName, [truthIds, falseIds]] of this.blobTruthFalseOccurrences) {
      copy.blobTruthFalseOccurrences.set(blobName, [
        [...truthIds],
        [...falseIds]
      ]);
    }

    // Copy nextPossibilityId
    copy.possibilityIdCounter = this.possibilityIdCounter;

    return copy;
  }

  public show(): string {
    let result = "Possibility Map:\n";
    for (const [id, possibility] of this.blobConfigurationMap) {
      result += `ID: ${id}, Possibility: ${JSON.stringify(Array.from(possibility.entries()))}\n`;
    }

    result += "\nBlob Occurrences:\n";
    for (const [blobName, [trueOccurrences, falseOccurrences]] of this.blobTruthFalseOccurrences) {
      result += `Blob: ${blobName}\n`;
      result += `  Truth occurrences: ${JSON.stringify(trueOccurrences)}\n`;
      result += `  False occurrences: ${JSON.stringify(falseOccurrences)}\n`;
    }

    return result;
  }

  private updateBlobOccurrences(possibility: Map<string, BlobType>, possibilityId: number): void {
    // Iterate through each entry in the possibility map
    for (const [blobName, blobType] of possibility) {
      // Get the current occurrences for the blob, or initialize if not present
      let occurrences = this.blobTruthFalseOccurrences.get(blobName);
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
      this.blobTruthFalseOccurrences.set(blobName, occurrences);
    }
  }

}

export default PossibilityCombinations;