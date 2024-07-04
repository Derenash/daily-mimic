import { getBlobText } from "../text/clueToText.js";
import { Blob, GroupSide } from "../types/blobTypes.js";
import { createBlobElement } from "./createBlobElement.js";
import { createBubbleElement } from "./createBubbleElement.js";
import { flipBlob } from "./utils.js";

export function createCharAndChatContainer(blob: Blob): HTMLDivElement | null {
  const side = blob.side as GroupSide;
  if (!side) {
    console.error("Invalid side");
    return null
  }
  const flip = side === "right"
  const character = createBlobElement(blob);
  if (flip) {
    flipBlob(character)
  }

  const blobText = getBlobText(blob);
  const bubble = createBubbleElement(blobText, side);
  const charAndChatContainer = document.createElement('div');
  charAndChatContainer.className = 'char-and-chat-container'
  charAndChatContainer.classList.add(side)
  charAndChatContainer.setAttribute('data-name', blob.name)
  charAndChatContainer.appendChild(character)
  charAndChatContainer.appendChild(bubble)

  return charAndChatContainer
}