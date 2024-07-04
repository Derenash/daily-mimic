export function setupMessageHighlighting(): void {
  const chatRectangle = document.querySelector('.chat-rectangle');
  if (!chatRectangle) return;

  const messages = chatRectangle.querySelectorAll('.message') as NodeListOf<HTMLElement>;

  messages.forEach((message: HTMLElement) => {
    message.addEventListener('mouseover', () => highlightMessage(message));
    message.addEventListener('mouseout', () => removeHighlight(message));
  });
}

function highlightMessage(message: HTMLElement): void {
  const text = message.textContent?.toLowerCase() || '';
  const colorMatch = text.match(/all (\w+)s are/);

  if (colorMatch) {
    const color = colorMatch[1];
    const blobsToHighlight = document.querySelectorAll(`[data-blob-color="${color}"]`) as NodeListOf<HTMLElement>;

    blobsToHighlight.forEach((blob: HTMLElement) => {
      blob.classList.add('blob-highlight');
    });

    const isTrue = text.includes('truth') || text.includes('true');
    message.classList.add(isTrue ? 'message-highlight-true' : 'message-highlight-false');
  }
}

function removeHighlight(message: HTMLElement): void {
  const blobsToUnhighlight = document.querySelectorAll('.blob-highlight') as NodeListOf<HTMLElement>;
  blobsToUnhighlight.forEach((blob: HTMLElement) => {
    blob.classList.remove('blob-highlight');
  });

  message.classList.remove('message-highlight-true', 'message-highlight-false');
}