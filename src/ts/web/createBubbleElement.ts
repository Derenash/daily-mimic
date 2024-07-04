import { GroupSide } from "../types/index.js";

export function createBubbleElement(body: string, originDirection: GroupSide): HTMLDivElement {
  const container = document.createElement('div');
  container.classList.add('chat-container');
  container.innerHTML = `
    <div class="chat-rectangle fill"></div>
    <div class="chat-rectangle stroke"></div>
    <svg class="bubble ${originDirection}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="stroke"
        d="M12 -1C11.7201 -1 11.453 -0.882699 11.2636 -0.6766C11.0743 -0.470501 10.9799 -0.194469 11.0036 0.0844243C11.2459 2.94486 11.5316 7.6398 10.7658 12.1903C9.99574 16.7659 8.20388 20.9617 4.49411 23.1374C4.04718 23.3995 3.87447 23.9596 4.09617 24.4279C4.31788 24.8962 4.86056 25.1176 5.34657 24.938C8.55486 23.7526 12.9952 20.9569 16.8595 16.7859C20.7332 12.6047 24.0809 6.98386 24.9913 0.13171C25.0292 -0.153961 24.9421 -0.442118 24.7522 -0.658897C24.5624 -0.875676 24.2882 -1 24 -1H18H12Z" />
      <path class="fill" d="M5 24C13.1846 19.2 12.4872 5.75 12 0H24C22.2462 13.2 11.0897 21.75 5 24Z" />
    </svg>
    ${body}
    </line>`;

  return container;
}