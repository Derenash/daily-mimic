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
  groups: BlobGroup[];
}

export interface BlobGroup {
  blobs: Blob[];
  side?: GroupSide;
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

export type ClueTarget = ClueTargetAll | ClueTargetSome | ClueTargetRange | ClueTargetQuantity;

export interface ClueTargetAll {
  type: "all";
}

export interface ClueTargetSome {
  type: "some";
}

export interface ClueTargetQuantity {
  type: "quantity";
  amount: number;
}

export interface ClueTargetRange {
  type: "range";
  minimum: number;
  maximum: number;
}