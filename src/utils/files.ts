import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import NodeJS from 'node:process';

/**
 * Sanitizes a string by removing accents, special characters, and normalizing it.
 *
 * @param str - Original string (e.g. file name without extension).
 * @returns A clean, lowercase, underscore-separated string.
 *
 */
const slugify = (str: string): string =>
  str
    .normalize('NFD') // Decompose accented characters (e.g. é → e +  ́)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w-]+/g, '_') // Replace non-word characters with underscores
    .replace(/_+/g, '_') // Collapse multiple underscores
    .toLowerCase();

/**
 * Generates a unique, clean filename by appending a timestamp and slugifying the base name.
 *
 * @param originalName - The original file name including extension.
 * @returns A new filename in the format: timestamp-slugified.ext
 *
 */
export const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);
  return `${Date.now()}-${slugify(base)}${ext}`;
};

/**
 * Deletes a file if it exists on the file system.
 *
 * @param filePath - Absolute path to the file to be deleted.
 * @returns A promise that resolves when the file is deleted or doesn't exist.
 */
export const deleteFileIfExists = async (filePath: string): Promise<void> => {
  try {
    await fsp.unlink(filePath);
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code !== 'ENOENT') {
      console.error(`❌ Failed to delete file at ${filePath}:`, error.message);
    }
  }
};

/**
 * Ensures that a given directory exists. If the directory does not exist,
 * it will be created recursively. If creation fails, an error is thrown.
 *
 * @param dirPath - The absolute or relative path to the directory.
 * @throws Will throw an error if the directory cannot be created.
 *
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  try {
    const resolvedPath = path.resolve(dirPath);

    if (!fs.existsSync(resolvedPath)) {
      fs.mkdirSync(resolvedPath, { recursive: true });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to create directory "${dirPath}": ${errorMessage}`);
    throw new Error(`Directory initialization failed: ${errorMessage}`);
  }
};
