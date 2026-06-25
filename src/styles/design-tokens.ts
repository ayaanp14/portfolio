export const colors = {
  ink: "#050505",
  cyan: "#54f4ff",
  blue: "#7aa7ff",
  purple: "#8b5cf6",
  glassWhite: "rgba(255, 255, 255, 0.72)",
} as const;

export const easings = {
  outExpo: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  sharp: [0.76, 0, 0.24, 1],
} as const;

export const layout = {
  pageMaxWidth: 1200,
  navHeight: 72,
} as const;
