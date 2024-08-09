import { AllClue, Blob, BlobColor, BlobType, Clue, ClueTarget, ClueTargetAll, ClueTargetRange, ClueTargetSome, ColorClue, GroupSide, SideClue, SpecificClue } from "../types";

// Checks if the blob we're looking at is the target of the clue
// Returns "true", "maybe", or "false"
// True = Clue says it IS what it suggest
// Maybe = Clue says it CAN BE what it suggest
// False = Clue says nothing about it
export function BlobNameIsTargeted(clue: Clue, targetName: string, blobsMap: Map<string, Blob>): string {
  const target = blobsMap.get(targetName);
  if (!target) return "false";

  if (clue.clueType === "color") {
    if (target.color === clue.color) {
      if (clue.target.type === "all") {
        return "true";
      }
      return "maybe";
    }
    return "false";
  }

  if (clue.clueType === "side") {
    if (target.side === clue.side) {
      if (clue.target.type === "all") {
        return "true";
      }
      return "maybe";
    }
    return "false";
  }

  if (clue.clueType === "specific") {
    if (target.name === clue.blobName) {
      return "true";
    }
    return "false";

  }

  if (clue.clueType === "all") {
    return "false";
  }

  return "false";
}