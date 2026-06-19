export const FORMALISATION_FILE_ACCEPT =
  ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/webp";

export const FORMALISATION_FILE_MAX_SIZE = 10 * 1024 * 1024;

const FORMALISATION_ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "jpg", "jpeg", "png", "webp"];
const FORMALISATION_ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function isFormalisationFileAccepted(file?: File): boolean {
  if (!file) return true;
  const extension = file.name.split(".").pop()?.toLowerCase();
  return Boolean(
    (extension && FORMALISATION_ALLOWED_EXTENSIONS.includes(extension)) ||
      FORMALISATION_ALLOWED_TYPES.includes(file.type)
  );
}
