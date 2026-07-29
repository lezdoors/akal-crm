/**
 * The tag palette is drawn from the register's own inks, not upstream's pastel
 * set (#fad2e1 pink, #99c1de blue, …), which put four or five hues on a single
 * client row. Tags separate by depth of ink and by the house's warm tones,
 * never by hue. Values track the tokens in src/index.css — see DESIGN.md.
 *
 * Tags created before this change keep the colour stored on their row;
 * re-picking a colour moves them onto the register palette.
 */
export const colors = [
  "#1c1a17", // ink
  "#57534c", // ink-soft
  "#8d867c", // ink-muted
  "#d2cbc0", // input
  "#8b5a2b", // tobacco
  "#b89073", // clay
  "#4a5c37", // sage-ink
  "#7f9d63", // sage
  "#a4441f", // rust-ink
  "#cc9e3d", // brass
];

const PALETTE = new Set(colors.map((c) => c.toLowerCase()));

/** The four ink steps a legacy colour can land on, darkest first. */
const INK_STEPS = ["#1c1a17", "#57534c", "#8d867c", "#d2cbc0"];

/**
 * Tags created before the register palette carry upstream's pastels
 * (#fad2e1 pink, #99c1de blue, …), which put four or five hues on a single
 * client row. Rather than migrate rows we cannot reach, a stored colour that
 * is not part of the palette is read for its lightness alone and rendered in
 * the matching ink. Colours the user picks from the palette pass through
 * untouched, so the picker still means what it says.
 */
export function registerTagColor(color: string | undefined | null): string {
  if (!color) return "#8d867c";
  const hex = color.trim().toLowerCase();
  if (PALETTE.has(hex)) return color;

  const match = hex.match(/^#?([0-9a-f]{6})$/);
  if (!match) return "#8d867c";
  const int = parseInt(match[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  // Perceived lightness, 0–1.
  const lightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const step = Math.min(
    INK_STEPS.length - 1,
    Math.floor(lightness * INK_STEPS.length),
  );
  return INK_STEPS[step];
}
