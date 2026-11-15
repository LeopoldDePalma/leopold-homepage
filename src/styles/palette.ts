// The theme's colours as plain values, for code that cannot read CSS variables.
export const palette = {
  bg: {light: '#f0e7db', dark: '#202023'},
  fg: {light: '#2b2118', dark: '#ede6d9'},
  fgMuted: {light: '#6b5a48', dark: '#a79e90'},
  accent: {light: '#7d5a10', dark: '#d4a93a'},
  // Lighter by night so the red links keep 4.5:1 on the dark ground.
  seal: {light: '#9b2226', dark: '#dd6468'},
} as const;
