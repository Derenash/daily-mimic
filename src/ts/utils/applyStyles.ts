import { blobTypeChatStyles, blobTypeStyles } from "../constants/index.js";

export function applyAllInitialStyles() {
  applyStatementStyles();
}

function applyStatementStyles() {
  const styleElement = document.createElement('style');
  document.head.appendChild(styleElement);

  Object.entries(blobTypeStyles).forEach(([type, style]) => {
    const cssRule = `
      ${type} {
        color: ${style.color};
        font-weight: ${style.fontWeight};
      }
    `;
    styleElement.sheet?.insertRule(cssRule, styleElement.sheet.cssRules.length);
  });

  // dynamically write:
  // .char-and-chat-container.truth {
  //   --chat-fill-color: #8ec4d1;
  //   --chat-stroke-color: #008fb3;
  // }

  // .char-and-chat-container.lie {
  //   --chat-fill-color: #f4a261;
  //   --chat-stroke-color: #ff7b25;

  Object.entries(blobTypeChatStyles).forEach(([type, style]) => {
    const cssRule = `
      .char-and-chat-container.${type} {
        --chat-fill-color: ${style["--chat-fill-color"]};
        --chat-stroke-color: ${style["--chat-stroke-color"]};
      }
    `;
    styleElement.sheet?.insertRule(cssRule, styleElement.sheet.cssRules.length);
  });

}


// export const blobTypeChatStyles: Record<BlobType, Record<string, string>> = {
//   [blobType.TRUTH]: {
//     "--chat-fill-color": "#8ec4d1",
//     "--chat-stroke-color": "#008fb3",
//   },
//   [blobType.LIE]: {
//     "--chat-fill-color": "#f4a261",
//     "--chat-stroke-color": "#ff7b25",
//   },
// };