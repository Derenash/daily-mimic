import { BlobNameIsTargeted } from "../blob/utils.js";
import { blobType } from "../constants/index.js";
import { Blob, BlobType } from "../types/index.js";

export function setupMessageHighlighting(blobsMap: Map<string, Blob>): void {
  const charAndChatContainers = document.querySelectorAll('.char-and-chat-container') as NodeListOf<HTMLDivElement>;


  charAndChatContainers.forEach((container: HTMLDivElement) => {
    const name = container.getAttribute('data-name');
    if (!name) return;
    container.addEventListener('mouseover', () => {
      container.classList.add('hovered');
      highlightMessages(name, blobsMap)
    });
    container.addEventListener('mouseout', () => {
      container.classList.remove('hovered');
      removeHighlights()
    });
  });
}

function highlightMessages(blobName: string, blobsMap: Map<string, Blob>): void {
  const charAndChatContainers = document.querySelectorAll('.char-and-chat-container') as NodeListOf<HTMLDivElement>;
  const blob = blobsMap.get(blobName);
  if (!blob) return;

  charAndChatContainers.forEach((charAndChatContainer: HTMLDivElement) => {
    const blobName = charAndChatContainer.getAttribute('data-name');
    if (!blobName) return;

    const target = blobsMap.get(blobName);
    if (!target) return;

    const isTargeted = BlobNameIsTargeted(blob.clue, target.name, blobsMap);
    if (isTargeted === "true" || isTargeted === "maybe") {
      highlightMessage(charAndChatContainer, isTargeted, blob.clue.blobType);
    }
  });
}

function highlightMessage(charAndChatContainer: HTMLDivElement, isTargeted: string, blobType: BlobType): void {
  const className = isTargeted === "true" ? blobType : `maybe-${blobType}`;
  charAndChatContainer.classList.add(className);
}

function removeHighlights(): void {
  const charAndChatContainers = document.querySelectorAll('.char-and-chat-container') as NodeListOf<HTMLDivElement>;
  charAndChatContainers.forEach((charAndChatContainer: HTMLDivElement) => {
    removeHighlight(charAndChatContainer);
  });
}

function removeHighlight(charAndChatContainer: HTMLDivElement): void {
  charAndChatContainer.classList.remove(blobType.TRUTH);
  charAndChatContainer.classList.remove(`maybe-${blobType.TRUTH}`);
  charAndChatContainer.classList.remove(blobType.LIE);
  charAndChatContainer.classList.remove(`maybe-${blobType.LIE}`);
}