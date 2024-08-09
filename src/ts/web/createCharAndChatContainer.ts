import { getBlobText } from "../blob/index.js"
import { Blob, GroupSide } from "../types/blobTypes.js";
import { createBlobElement } from "./createBlobElement.js";
import { createBubbleElement } from "./createBubbleElement.js";
import { flipBlob } from "./utils.js";
import { AddBlobGuessState } from "./utils.js";

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
  charAndChatContainer.id = blob.name
  charAndChatContainer.appendChild(character)
  charAndChatContainer.appendChild(bubble)
  charAndChatContainer.addEventListener('click', (event) => {
    AddBlobGuessState(event.currentTarget as HTMLElement)
  })
  createAllButtonCheckElements(character)

  return charAndChatContainer
}

function createAllButtonCheckElements(element: HTMLElement) {
  const colors = ['green', 'red', 'yellow']
  colors.forEach((color) => {
    const button = createButtonCheckElement(color)
    element.appendChild(button)
  })
}

function createButtonCheckElement(color: string): HTMLElement {
  const button = document.createElement('img');
  button.src = `./assets/buttons/${color}_check_button.svg`;
  button.className = 'check-button';
  button.classList.add(color);
  return button;
}