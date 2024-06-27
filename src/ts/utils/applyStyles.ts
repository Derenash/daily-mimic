import { blobTypeStyles } from "../constants/index.js";

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
}