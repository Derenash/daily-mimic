export const blobColor = {
  RED: "red",
  BLUE: "blue",
  GREEN: "green",
  ORANGE: "orange",
} as const;

export const blobType = {
  TRUTH: "Legit",
  LIE: "Fake"
} as const;

export const groupSide = {
  LEFT: "left",
  RIGHT: "right",
  TOP: "top",
  BOTTOM: "bottom"
} as const;

export const blobColors = Object.values(blobColor);

export const groupSides = Object.values(groupSide);