import { Blob } from "../types/index.js";
import { createImageElement, setDelayToCharacters } from "./utils.js";

export function createBlobElement(blob: Blob): HTMLDivElement {
  const color = blob.color;
  const name = blob.name;
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('character-container-container');
  characterContainerContainer.setAttribute('data-blob-name', name);

  const characterName = document.createElement('div');
  characterName.classList.add('character-name');
  characterName.textContent = name;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('character-container');

  let path = "../assets/img/"

  const body = createImageElement('body', `${path}body.svg`);
  const hat = createImageElement('hat', `${path}hat-${color}.svg`);

  body.classList.add('idle');
  hat.classList.add('idle');

  setDelayToCharacters([body, hat], 1000);

  characterContainer.appendChild(body);
  characterContainer.appendChild(hat);
  characterContainerContainer.appendChild(characterContainer);
  characterContainerContainer.appendChild(characterName);

  return characterContainerContainer;
}