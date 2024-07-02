/**
 * Utility functions for coloring console output using ANSI escape codes.
 * Supports inline usage inside template literals.
 *
 * Example:
 *   console.log(`URL: ${color.blue('http://localhost:3000')}`);
 */

const applyColor =
  (code: number) =>
  (text: string): string =>
    `\x1b[${code}m${text}\x1b[0m`;

export const color = {
  red: applyColor(31), // Errors
  green: applyColor(32), // Success
  yellow: applyColor(33), // Warnings
  blue: applyColor(34), // Info / Links
  magenta: applyColor(35), // Debug
  cyan: applyColor(36), // System messages
} as const;

export type ConsoleColor = keyof typeof color;
