import { blobColor, blobType as blobClassification, groupSide, blobType } from "../constants/index.js";

import { blobMapFromList, addToLocalCount, getBlobType, getRealClueType, isStatementTrue, log, moveElementToStart } from "../utils/generalUtils.js";

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