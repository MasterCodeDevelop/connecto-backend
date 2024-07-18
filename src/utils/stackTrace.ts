/**
 * Parses a JavaScript error stack trace to extract contextual information,
 * such as the function name, file path, line number, and column number.
 *
 * This utility is particularly useful for logging purposes,
 * allowing better traceability of where errors originated in the codebase.
 *
 * The function searches for the first relevant stack frame that refers
 * to a source file within the `src/` directory (compatible with both Windows and Unix paths).
 *
 * @param stack - The error stack trace as a string.
 * @returns An object containing parsed location data, or null if not found.
 */
export function parseStackTrace(stack?: string) {
  if (!stack) return null;

  const stackLines = stack.split('\n');

  // Locate the first relevant stack frame referencing application code in the `src/` directory
  const relevantLine = stackLines.find(
    (line) => line.includes('at') && (line.includes('\\src\\') || line.includes('/src/')),
  );

  if (!relevantLine) return null;

  // Cross-platform regex to extract function name, file path, line and column numbers
  const regex = /\s+at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/;
  const match = relevantLine.match(regex);

  // Extract function name, file path, line and column numbers
  if (match) {
    const [, functionName, filePath, line, column] = match;

    return {
      functionName: functionName || 'anonymous',
      filePath,
      line: Number(line),
      column: Number(column),
    };
  }

  return null;
}
