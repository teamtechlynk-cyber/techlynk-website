// Secrets come from the environment. Non-secret contact details fall back to
// sensible defaults so the site renders without extra configuration.
const DEFAULT_FROM_EMAIL = "support@techlynk.co"
const DEFAULT_TO_EMAIL = "support@techlynk.co"
const DEFAULT_CONTACT_PHONE = "+91 95737 87824"
const DEFAULT_CONTACT_LOCATION = "Hyderabad, India"

export const env = {
  // No fallback: an unset key makes the mail routes return 503 rather than
  // shipping a credential in the bundle.
  RESEND_API_KEY: () => process.env.RESEND_API_KEY ?? "",
  RESEND_FROM_EMAIL: () => process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM_EMAIL,
  RESEND_TO_EMAIL: () => process.env.RESEND_TO_EMAIL ?? DEFAULT_TO_EMAIL,
  CONTACT_PHONE: () => process.env.CONTACT_PHONE ?? DEFAULT_CONTACT_PHONE,
  CONTACT_LOCATION: () =>
    process.env.CONTACT_LOCATION ?? DEFAULT_CONTACT_LOCATION,
  NODE_ENV: process.env.NODE_ENV ?? "development",
}
