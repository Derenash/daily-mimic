import { blobColors } from "../constants/index.js";
import { Blob, BlobColor } from "../types/blobTypes.js";

export function getRandomColor(): BlobColor {
  const random = Math.floor(Math.random() * blobColors.length);
  return blobColors[random];
}

export function blobMapFromList(blobs: Blob[]): Map<string, Blob> {
  const map = new Map();
  blobs.forEach((blob) => {
    map.set(blob.name, blob);
  });
  return map;
}

export function moveElementToStart(array: string[], element: string): string[] {
  const index = array.indexOf(element);
  // If the element doesn't exist in the array, return the original array
  if (index === -1) {
    return array;
  }
  // Remove the element from its current position
  array.splice(index, 1);
  // Add the element to the beginning of the array
  array.unshift(element);
  return array;
}
