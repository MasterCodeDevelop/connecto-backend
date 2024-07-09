import multer, { FileFilterCallback, Multer } from 'multer';
import path from 'path';
import { ensureDirectoryExists, generateFileName } from '../utils/files';
import { Express } from 'express';

/**
 * Supported MIME types grouped by category.
 */
const MIME_TYPES: Record<'image' | 'video', string[]> = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
};

type FileType = 'image' | 'video' | 'any';

/**
 * Base upload directory, configurable via .env or defaults to `private/uploads`
 */
const BASE_UPLOADS_DIR = path.join(
  process.cwd(),
  process.env.UPLOADS_BASE_PATH || 'private/uploads',
);
/**
 * Creates a configurable multer middleware instance with storage, file filter and size limit.
 *
 * @param fileType - Type of file accepted: 'image' | 'video' | 'any'
 * @param subDir - Subdirectory within the base upload path
 * @param fieldName - Field name expected in the form (default: 'file')
 * @param maxSizeMB - Maximum file size allowed (default: 20 MB)
 *
 * @returns An object with preconfigured multer methods: single, array, fields
 */
export const createUploadMiddleware = (
  fileType: FileType,
  subDir: string,
  fieldName = 'file',
  maxSizeMB = 20,
): {
  single: ReturnType<Multer['single']>;
} => {
  const uploadPath = path.join(BASE_UPLOADS_DIR, subDir);
  ensureDirectoryExists(uploadPath);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => cb(null, generateFileName(file.originalname)),
  });

  /**
   * Validates MIME type based on the fileType parameter.
   */
  const fileFilter = (_req: unknown, file: Express.Multer.File, cb: FileFilterCallback): void => {
    const isImage = MIME_TYPES.image.includes(file.mimetype);
    const isVideo = MIME_TYPES.video.includes(file.mimetype);

    const isAllowed =
      (fileType === 'image' && isImage) ||
      (fileType === 'video' && isVideo) ||
      (fileType === 'any' && (isImage || isVideo));

    if (isAllowed) {
      cb(null, true);
    } else {
      const allowed =
        fileType === 'any' ? [...MIME_TYPES.image, ...MIME_TYPES.video] : MIME_TYPES[fileType];
      cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          `Invalid file type: ${file.mimetype}. Allowed types: ${allowed.join(', ')}`,
        ),
      );
    }
  };

  // Create the multer instance
  const multerInstance = multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter,
  });

  return {
    single: multerInstance.single(fieldName),
  };
};
