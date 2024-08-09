import { Blob } from "../types";

export function flipBlob(containerContainer: HTMLElement): void {
  containerContainer.children[0].classList.add('flip');
}

// Animation Utils
export function setDelayToCharacters(characters: HTMLImageElement[] | NodeListOf<HTMLImageElement>, max: number, fixed?: number): number {
  const delay = Math.floor(Math.random() * max);
  characters.forEach(character => {
    character.style.animationDelay = `${delay}ms`;
  });
  return delay;
}

export function createImageElement(className: string, src: string): HTMLImageElement {
  const element = document.createElement('img');
  element.classList.add('character', className);
  element.src = src;
  element.alt = "Character";
  return element;
}

export function AddBlobGuessState(element: HTMLElement) {
  // const blobCheckStates: string[] = ["green", "yellow", "red", "none"];
  const blobCheckStates: string[] = ["green", "red", "none"];
  // Get the blobname from the element's id
  const blobname = element.id;
  // Get the current state from localStorage
  const storedState = localStorage.getItem('blobStates');
  let blobStates: [string, string][] = storedState ? JSON.parse(storedState) : [];

  // Find the blob in the list
  const blobIndex = blobStates.findIndex(([name, _]) => name === blobname);

  if (blobIndex === -1) {
    // If the blob is not found, add it with the "green" state
    blobStates.push([blobname, "green"]);
  } else {
    // If the blob is found, cycle to the next state
    const currentState = blobStates[blobIndex][1];
    const currentStateIndex = blobCheckStates.indexOf(currentState);
    const nextStateIndex = (currentStateIndex + 1) % blobCheckStates.length;
    const newState = blobCheckStates[nextStateIndex];
    element.classList.remove(currentState);
    element.classList.add(newState);
    blobStates[blobIndex][1] = newState;
  }

  // Save the updated state back to localStorage
  localStorage.setItem('blobStates', JSON.stringify(blobStates));
}

export function createInitialBlobCheckStates(blobs: Blob[]): void {
  // Initialize the blobStates array with all blobs set to "none"
  const blobStates: [string, string][] = blobs.map(blob => [blob.name, "none"]);
  // Save the initial state to localStorage
  localStorage.setItem('blobStates', JSON.stringify(blobStates));
}