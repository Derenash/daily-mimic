import { boardConfig } from "../constants/index.js";

export function createCharacterElement(className: string, src: string): HTMLImageElement {
  const element = document.createElement('img');
  element.classList.add('character', className);
  element.src = src;
  element.alt = "Character";
  return element;
}


export function createMainElement(): HTMLElement {
  const main = document.createElement('main');
  main.style.width = `${boardConfig.width}px`;
  main.style.height = `${boardConfig.height}px`;
  return main;
}