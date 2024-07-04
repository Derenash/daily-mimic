import { getBlobText } from "../text/clueToText.js";
import { Blob, GroupSide } from "../types/blobTypes.js";
import { createBlobElement } from "./createBlobElement.js";
import { createBubbleElement } from "./createBubbleElement.js";
import { flipBlob } from "./utils.js";

export function addToGroup(element: HTMLElement, blob: Blob): HTMLElement {
  const side = blob.side as GroupSide;
  if (!side) {
    console.error("Invalid side");
    return element;
  }
  const flip = side === "right"
  const character = createBlobElement(blob);
  if (flip) {
    flipBlob(character)
  }
  const blobText = getBlobText(blob);
  const bubble = createBubbleElement(blobText, side);
  const gigaContainer = document.createElement('div');
  gigaContainer.className = 'character-container-container-container'
  gigaContainer.classList.add(side)
  gigaContainer.appendChild(character)
  gigaContainer.appendChild(bubble)
  element.appendChild(gigaContainer);


  return element;

}
