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