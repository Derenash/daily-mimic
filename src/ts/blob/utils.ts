import { AllClue, Blob, BlobColor, BlobGroup, BlobType, Clue, ClueTarget, ClueTargetAll, ClueTargetQuantity, ClueTargetRange, ClueTargetSome, ColorClue, GroupSide, SideClue, SpecificClue } from "../types";

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

export function blobGroup(blobs: Blob[], side?: GroupSide): BlobGroup {
  return {
    side: side,
    blobs: blobs
  };
}

export function blob(name: string, color: BlobColor, clue: Clue, side?: GroupSide): Blob {
  return {
    name: name,
    color: color,
    clue: clue,
    side: side
  };
}

export function clueSide(target: ClueTarget, side: GroupSide, blobType: BlobType): SideClue {
  return {
    clueType: "side",
    side: side,
    target: target,
    blobType: blobType
  };
}

export function clueColor(target: ClueTarget, color: BlobColor, blobType: BlobType): ColorClue {
  return {
    clueType: "color",
    color: color,
    target: target,
    blobType: blobType
  };
}

export function clueSpecific(blobName: string, blobType: BlobType): SpecificClue {
  return {
    clueType: "specific",
    blobName: blobName,
    blobType: blobType
  };
}

export function clueAll(amount: number, blobType: BlobType): AllClue {
  return {
    clueType: "all",
    amount: amount,
    blobType: blobType
  };
}

export function targetAll(): ClueTargetAll {
  return {
    type: "all"
  };
}

export function targetSome(): ClueTargetSome {
  return {
    type: "some"
  };
}

export function targetQuantity(amount: number): ClueTargetQuantity {
  return {
    type: "quantity",
    amount: amount
  };
}

export function targetRange(minimum: number, maximum: number): ClueTargetRange {
  return {
    type: "range",
    minimum: minimum,
    maximum: maximum
  };
}