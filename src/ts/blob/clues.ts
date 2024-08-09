import { AllClue, BlobColor, BlobType, ClueTarget, ClueTargetAll, ClueTargetRange, ClueTargetSome, ColorClue, GroupSide, SideClue, SpecificClue } from "../types";

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

export function targetRange(minimum: number, maximum: number): ClueTargetRange {
  return {
    type: "range",
    minimum: minimum,
    maximum: maximum
  };
}