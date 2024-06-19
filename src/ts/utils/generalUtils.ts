import { blobConfig, boardConfig } from "../constants/index.js";
import { setDelayToCharacters } from "./animationUtils.js";
import { createCharacterElement } from "./webUtils.js";

export function getRandomColor(): string {
  const colors = ['blue', 'green', 'red', 'orange'];
  const random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

export function createCharacter(color: string, position: { x: number, y: number }, name: string): HTMLDivElement {
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('character-container-container');
  characterContainerContainer.style.left = `${position.x}px`;
  characterContainerContainer.style.top = `${position.y}px`;

  const characterName = document.createElement('div');
  characterName.classList.add('character-name');
  // upper case first letter
  characterName.textContent = name;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('character-container');

  let path = "../assets/img/"

  if (Math.random() > 0.5) {
    path = "../assets/img/"
    characterContainer.style.transform = "scaleX(-1)";
  }

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

export function createMultipleCharacters(parent: HTMLElement, amount: number, blobNames: string[]): void {
  const alreadyUsedNames = new Set<string>();
  const entities: { x: number; y: number }[] = [];

  let placedCount = 0;
  while (placedCount < amount) {
    let name: string;
    while (true) {
      name = blobNames[Math.floor(Math.random() * blobNames.length)];
      if (!alreadyUsedNames.has(name)) {
        alreadyUsedNames.add(name);
        break;
      }
    }

    const position = {
      x: Math.random() * (boardConfig.width - blobConfig.width),
      y: Math.random() * (boardConfig.height - blobConfig.height)
    };

    let overlap = false;
    for (const entity of entities) {
      const distanceX = Math.abs(position.x - entity.x);
      const distanceY = Math.abs(position.y - entity.y);

      if (distanceX < blobConfig.width + blobConfig.gap && distanceY < blobConfig.height + blobConfig.gap) {
        overlap = true;
        break;
      }
    }

    if (!overlap) {
      entities.push(position);
      const color = getRandomColor();
      const character = createCharacter(color, position, name);
      parent.appendChild(character);
      placedCount++;
    }
  }

  if (placedCount < amount) {
    console.log("It was not possible to place all the entities in the given area with the minimum gap.");
  }
}