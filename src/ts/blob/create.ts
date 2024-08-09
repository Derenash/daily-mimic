import { Blob, BlobColor, Clue, GroupSide } from "../types";

export function newBlob(name: string, color: BlobColor, clue: Clue, side?: GroupSide): Blob {
  return {
    name: name,
    color: color,
    clue: clue,
    side: side
  };
}
