/**
 * Resume upload limits, shared by the apply form (client) and the apply API
 * route (server). Kept out of validations.ts so the client bundle doesn't pull
 * in zod just to read these constants.
 */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024 // 5MB
export const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"] as const
export const RESUME_ACCEPT_ATTRIBUTE =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
