import { blobColors } from "../constants/index.js";
import { BlobColor } from "../types/blobTypes.js";

export function getRandomColor(): BlobColor {
  const random = Math.floor(Math.random() * blobColors.length);
  return blobColors[random];
}