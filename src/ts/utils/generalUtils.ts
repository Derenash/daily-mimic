import { blobColors } from "../constants/index.js";
import { getBlobText } from "../text/clueToText.js";
import { BlobGroup, GroupSide, Blob, BlobColor } from "../types/blobTypes.js";
import { setDelayToCharacters } from "./animationUtils.js";
import { createBubbleElement, createCharacterElement } from "./webUtils.js";

export function getRandomColor(): BlobColor {
  const random = Math.floor(Math.random() * blobColors.length);
  return blobColors[random];
}
export function createBlob(blob: Blob): HTMLDivElement {
  const color = blob.color;
  const name = blob.name;
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('character-container-container');

  const characterName = document.createElement('div');
  characterName.classList.add('character-name');
  characterName.textContent = name;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('character-container');

  let path = "../assets/img/"

  const body = createCharacterElement('body', `${path}body.svg`);
  const hat = createCharacterElement('hat', `${path}hat-${color}.svg`);

  body.classList.add('idle');
  hat.classList.add('idle');

  setDelayToCharacters([body, hat], 1000);

  characterContainer.appendChild(body);
  characterContainer.appendChild(hat);
  characterContainerContainer.appendChild(characterContainer);
  characterContainerContainer.appendChild(characterName);

  return characterContainerContainer;
}

export function flipBlob(containerContainer: HTMLElement): void {
  containerContainer.children[0].classList.add('flip');
}

function divideBlobsInGroups(blobs: Blob[]): BlobGroup[] {
  const groups: BlobGroup[] = [];

  const groupsNames: GroupSide[] = ["left", "right", "top", "bottom"];
  const blobsPerGroup = 3;
  const totalGroups = 4;

  for (let i = 0; i < totalGroups; i++) {
    const group: BlobGroup = {
      side: groupsNames[i],
      blobs: blobs.slice(i * blobsPerGroup, (i + 1) * blobsPerGroup),
    };
    groups.push(group);
  }

  return groups;
}

export function drawGroup(element: HTMLElement, group: BlobGroup): HTMLElement {
  group.blobs.forEach((blob, index: number) => {
    const flip = group.side === "right"
    const character = createBlob(blob);
    if (flip) {
      flipBlob(character)
    }
    if (!group.side) {
      console.error("Invalid side");
      return "";
    }
    const blobText = getBlobText(blob);
    let bubble;
    if (group.side === "top" || group.side === "bottom") {
      if (index >= (group.blobs.length - 1) / 2) {
        bubble = createBubbleElement(blobText, group.side, "right");
      } else {
        bubble = createBubbleElement(blobText, group.side, "left");
      }
    } else {
      bubble = createBubbleElement(blobText, group.side);
    }
    const gigaContainer = document.createElement('div');
    gigaContainer.className = 'character-container-container-container'
    gigaContainer.classList.add(group.side)
    gigaContainer.appendChild(character)
    gigaContainer.appendChild(bubble)
    element.appendChild(gigaContainer);
  })

  return element;

}




export function setGroupSide(group: BlobGroup, side: GroupSide): BlobGroup {
  group.side = side;
  group.blobs.forEach(blob => {
    blob.side = side;
  });
  return group;
}