import { Blob } from "../types/index.js";
import { createImageElement, setDelayToCharacters } from "./utils.js";

export function createBlobElement(blob: Blob): HTMLDivElement {
  const color = blob.color;
  const name = blob.name;
  const characterContainerContainer = document.createElement('div');
  characterContainerContainer.classList.add('char-and-name-container');

  const characterName = document.createElement('div');
  characterName.classList.add('character-name');
  characterName.textContent = name;

  const characterContainer = document.createElement('div');
  characterContainer.classList.add('char-imgs-container');

  let path = "./assets/img/"

  const body = document.createElement('div') as HTMLImageElement;
  body.innerHTML = `
    <svg width="110" height="74" viewBox="0 0 110 74" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_20_724)">
      <path d="M54.2635 28.3277C40.3844 29.4879 21.1079 38.2858 22.5536 58.7822C23.6925 74.928 47.9665 73.4456 60.2393 73.091C73.6365 72.704 89.0577 73.091 89.0577 57.7187C89.0577 27.1674 62.9027 27.6056 54.2635 28.3277Z" fill="var(--blob-head-color)"/>
      <path d="M54.2634 56.4619C58.4079 52.8847 55.9983 44.0867 50.119 43.99C49.1552 43.99 44.7216 44.7634 44.0469 49.9842C43.1794 57.5254 50.119 60.0391 54.2634 56.4619Z" fill="black"/>
      <path d="M52.5285 48.6307C52.5285 46.6971 50.8578 46.2137 50.0225 46.2137C49.5727 46.2459 48.4804 46.407 47.9021 47.2771C47.2583 48.2458 47.613 50.142 49.2515 50.661C49.7334 50.8137 52.5285 51.0477 52.5285 48.6307Z" fill="var(--blob-eye-color)"/>
      <path d="M81.1003 56.2512C85.1156 52.7621 82.7811 44.1809 77.0851 44.0866C76.1513 44.0866 71.8559 44.841 71.2023 49.9332C70.3619 57.2885 77.0851 59.7403 81.1003 56.2512Z" fill="black"/>
      <path d="M79.0337 48.6742C79.0337 46.8604 77.5309 46.407 76.7795 46.407C76.3749 46.4372 75.3923 46.5884 74.8721 47.4046C74.293 48.3132 74.612 50.0918 76.0859 50.5787C76.5194 50.7219 79.0337 50.9415 79.0337 48.6742Z" fill="var(--blob-eye-color)"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M72.6726 71.2541C62.938 71.6408 32.8666 72.1242 32.2883 59.8457C31.5075 43.2675 67.8479 34.3723 85.593 41.4726C78.1904 27.3786 60.9619 27.7678 54.2635 28.3277C40.3844 29.4879 21.1079 38.2858 22.5536 58.7822C23.6441 74.2419 45.9454 73.5397 58.6124 73.1409C59.1746 73.1232 59.7178 73.1061 60.2393 73.091C60.8911 73.0722 61.5478 73.0552 62.2073 73.0381C64.3476 72.9827 66.5173 72.9265 68.6475 72.8045L72.6726 71.2541Z" fill="black" fill-opacity="0.2"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M74.4052 32.3442C67.0775 28.8634 58.6405 29.1261 54.3595 29.4839C47.5851 30.0502 39.5234 32.4838 33.3658 37.2242C27.2533 41.93 23.0157 48.8969 23.7072 58.7004C23.9684 62.4036 25.5357 65.045 27.9226 66.9763C30.349 68.9395 33.672 70.2049 37.4549 70.988C44.3992 72.4256 52.5143 72.1712 58.5876 71.9808C59.145 71.9633 59.6853 71.9464 60.2059 71.9314C60.8547 71.9126 61.5053 71.8956 62.156 71.8786C68.3165 71.7175 74.4877 71.556 79.3023 69.9252C81.928 69.0358 84.0523 67.7367 85.5263 65.8385C86.992 63.9509 87.901 61.3594 87.901 57.7187C87.901 50.2486 86.3034 44.7674 83.8492 40.7412C81.3972 36.7188 78.0439 34.0727 74.4052 32.3442ZM85.8227 39.5308C88.5424 43.9925 90.2142 49.9133 90.2142 57.7187C90.2142 61.7642 89.1956 64.889 87.3512 67.2643C85.515 69.6291 82.9466 71.1398 80.0424 72.1236C74.8729 73.8746 68.3303 74.0422 62.2537 74.1979C61.5869 74.215 60.9256 74.2319 60.2725 74.2508C59.7506 74.2658 59.205 74.2831 58.6386 74.301C52.6061 74.4918 44.2168 74.7571 36.9874 73.2605C33.0253 72.4403 29.2992 71.0712 26.4704 68.7824C23.6021 66.4617 21.708 63.2338 21.3998 58.8641C20.6456 48.1712 25.3234 40.4908 31.9575 35.3835C38.5465 30.3109 47.0627 27.7655 54.1674 27.1716C58.5255 26.8073 67.4856 26.4898 75.3952 30.2472C79.3752 32.1378 83.1006 35.0654 85.8227 39.5308Z" fill="black"/>
      </g>
      <defs>
      <clipPath id="clip0_20_724">
      <rect width="110" height="74" fill="var(--blob-head-color)"/>
      </clipPath>
      </defs>
    </svg>
`
  body.classList.add('character', 'body');

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