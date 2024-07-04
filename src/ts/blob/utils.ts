import { AllClue, Blob, BlobColor, BlobGroup, BlobType, Clue, ClueTarget, ClueTargetAll, ClueTargetQuantity, ClueTargetRange, ClueTargetSome, ColorClue, GroupSide, SideClue, SpecificClue } from "../types";

function getFilterCondition(blob: Blob): { blobType: BlobType, filter: (x: Blob) => boolean } {
  const clue = blob.clue;
  const blobType = blob.clue.blobType
  const filter = (x: Blob) => {
    if (clue.clueType === "color") {
      return x.color === clue.color;
    }

    if (clue.clueType === "side") {
      return x.side === clue.side;
    }

    if (clue.clueType === "specific") {
      return x.name === clue.blobName;
    }

    if (clue.clueType === "all") {
      return true;
    }

    return false;
  }
  return { blobType, filter };
}

// type generators
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