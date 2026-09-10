import { Resend } from "resend"
import { NextResponse } from "next/server"
import { env } from "@/lib/env"
import { isRateLimited } from "@/lib/rate-limit"
import { applicationSchema, escapeHtml } from "@/lib/validations"
import { RESUME_ALLOWED_EXTENSIONS, RESUME_MAX_BYTES } from "@/lib/resume"

/** Strip path separators so an uploaded name can't traverse or spoof a path. */
function sanitizeFilename(name: string): string {
  return name.replace(/[/\\]/g, "_").replace(/[^\w.\- ]/g, "").slice(0, 120) || "resume"
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  try {
    const apiKey = env.RESEND_API_KEY()
    if (!apiKey) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          {
            error:
              "Email service is not configured. Set RESEND_API_KEY in your environment (see .env.example).",
          },
          { status: 503 }
        )
      }
      return NextResponse.json(
        {
          error:
            "Email is not configured locally. Copy .env.example to .env.local and set RESEND_API_KEY (get one at resend.com).",
        },
        { status: 503 }
      )
    }

    const form = await request.formData()
    const parsed = applicationSchema.safeParse({
      role: form.get("role") ?? "",
      name: form.get("name") ?? "",
      email: form.get("email") ?? "",
      phone: form.get("phone") ?? "",
      experience: form.get("experience") ?? "",
      noticePeriod: form.get("noticePeriod") ?? "",
      expectedRate: form.get("expectedRate") ?? "",
      message: form.get("message") ?? "",
    })
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join("; ")
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const resume = form.get("resume")
    if (!(resume instanceof File) || resume.size === 0) {
      return NextResponse.json({ error: "Resume file is required" }, { status: 400 })
    }
    if (resume.size > RESUME_MAX_BYTES) {
      return NextResponse.json(
        { error: "Resume is too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }
    const lowerName = resume.name.toLowerCase()
    if (!RESUME_ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload a PDF, DOC, or DOCX." },
        { status: 400 }
      )
    }

    const { role, name, email, phone, experience, noticePeriod, expectedRate, message } =
      parsed.data
    const resumeBuffer = Buffer.from(await resume.arrayBuffer())
    const filename = sanitizeFilename(resume.name)

    const resend = new Resend(apiKey)
    const fromEmail = env.RESEND_FROM_EMAIL()
    const toEmail = env.RESEND_TO_EMAIL()

    const row = (label: string, value: string) =>
      `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `Job Application – ${role} | ${name}`,
      html: `
        <h2>Job Application – ${escapeHtml(role)}</h2>
        ${row("Name", name)}
        ${row("Email", email)}
        ${phone ? row("Phone", phone) : ""}
        ${row("Total Experience", experience)}
        ${noticePeriod ? row("Notice Period / Availability", noticePeriod) : ""}
        ${expectedRate ? row("Expected Rate", expectedRate) : ""}
        ${
          message
            ? `<p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
            : ""
        }
        <p><strong>Resume:</strong> ${escapeHtml(filename)} (attached)</p>
      `,
      attachments: [{ filename, content: resumeBuffer }],
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error("Apply API error:", error)
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 })
  }
}
