// ==============================
// Cors Variables
// ==============================
export const whiteListOrigin = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8001',
  'http://localhost:5001',
  'http://localhost:8080',
];

// ==============================
// Byte Variables
// ==============================
export const Byte_Unit = 1024;

// ==============================
// Storage Variables
// ==============================
export const Storage_Unit = 2 * 1024 * 1024 * 1024;

// ==============================
// API Key Variables
// ==============================
export const KEY_TYPE = {
  LIVE: 'live',
} as const;

// ==============================
// Multer Variables
// ==============================
export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_FILES = 10;
export const ALLOWED_FILE_TYPES = [
  // Image file types
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',

  // Document file types
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  // Text files
  'text/plain',
  'text/csv',

  // Archive file types
  'application/zip',
  'application/x-zip-compressed',
  'application/x-tar',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',

  // Audio file types
  'audio/wav',
  'audio/webm',

  // Video
  'video/mp4',
  'video/webm',
];
