"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X, User, Mail, Phone, Clock, Briefcase, FileText, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { RESUME_ACCEPT_ATTRIBUTE, RESUME_MAX_BYTES } from "@/lib/resume"

type ApplyModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Pre-selected role; empty string lets the applicant pick one. */
  role: string
  roles: string[]
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  experience: "",
  noticePeriod: "",
  expectedRate: "",
  message: "",
}

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-70"
const labelClass = "flex items-center gap-2 label-small font-medium !normal-case mb-2"

export default function ApplyModal({ isOpen, onClose, role, roles }: ApplyModalProps) {
  const [fields, setFields] = useState(emptyForm)
  const [selectedRole, setSelectedRole] = useState(role)
  const [resume, setResume] = useState<File | null>(null)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [mounted, setMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setMounted(true), [])

  // Keep the dropdown in sync with whichever card was clicked.
  useEffect(() => {
    if (isOpen) setSelectedRole(role)
  }, [isOpen, role])

  const resetAndClose = () => {
    setFields(emptyForm)
    setResume(null)
    setStatus("idle")
    setErrorMsg("")
    if (fileInputRef.current) fileInputRef.current.value = ""
    onClose()
  }

  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetAndClose()
    }
    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const setField = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file && file.size > RESUME_MAX_BYTES) {
      setErrorMsg("Resume is too large. Maximum size is 5MB.")
      setStatus("error")
      e.target.value = ""
      setResume(null)
      return
    }
    setErrorMsg("")
    setStatus("idle")
    setResume(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resume) {
      setErrorMsg("Please attach your updated resume.")
      setStatus("error")
      return
    }
    setStatus("loading")
    setErrorMsg("")

    try {
      const body = new FormData()
      body.append("role", selectedRole)
      Object.entries(fields).forEach(([key, value]) => body.append(key, value))
      body.append("resume", resume)

      const res = await fetch("/api/apply", { method: "POST", body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit application")

      setStatus("success")
      setTimeout(resetAndClose, 2000)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit application")
    }
  }

  if (!isOpen || !mounted) return null

  const isLoading = status === "loading"

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetAndClose} aria-hidden="true" />

      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-primary rounded-2xl border border-primary/30 shadow-2xl shadow-primary/15 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-form-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 id="apply-form-title" className="section-heading !mb-2 text-2xl sm:text-3xl gradient-text-glow">
                Apply Now
              </h2>
              <p className="card-desc">Send us your details and updated resume — we&apos;ll get back to you shortly.</p>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/15 transition-colors flex-shrink-0"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {status === "success" ? (
            <div className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/15 mb-4">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <p className="section-body text-foreground font-medium">
                Application received. Thank you — our team will review your profile and be in touch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}

              <div>
                <label htmlFor="apply-role" className={labelClass}>
                  <Briefcase className="w-4 h-4 text-primary" />
                  Role
                </label>
                <select
                  id="apply-role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                  disabled={isLoading}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                  <option value="Other / General Application">Other / General Application</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-name" className={labelClass}>
                    <User className="w-4 h-4 text-primary" />
                    Full Name
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    placeholder="Your full name"
                    value={fields.name}
                    onChange={setField("name")}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="apply-email" className={labelClass}>
                    <Mail className="w-4 h-4 text-primary" />
                    Email
                  </label>
                  <input
                    id="apply-email"
                    type="email"
                    placeholder="you@email.com"
                    value={fields.email}
                    onChange={setField("email")}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-phone" className={labelClass}>
                    <Phone className="w-4 h-4 text-primary" />
                    Phone <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="apply-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={fields.phone}
                    onChange={setField("phone")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="apply-experience" className={labelClass}>
                    <Clock className="w-4 h-4 text-primary" />
                    Total Experience
                  </label>
                  <input
                    id="apply-experience"
                    type="text"
                    placeholder="e.g. 8 years"
                    value={fields.experience}
                    onChange={setField("experience")}
                    required
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="apply-notice" className={labelClass}>
                    <Clock className="w-4 h-4 text-primary" />
                    Availability <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="apply-notice"
                    type="text"
                    placeholder="e.g. Immediate / 15 days"
                    value={fields.noticePeriod}
                    onChange={setField("noticePeriod")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="apply-rate" className={labelClass}>
                    <Briefcase className="w-4 h-4 text-primary" />
                    Expected Rate <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="apply-rate"
                    type="text"
                    placeholder="e.g. $60/hr or ₹1.2L/month"
                    value={fields.expectedRate}
                    onChange={setField("expectedRate")}
                    disabled={isLoading}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Resume upload */}
              <div>
                <label htmlFor="apply-resume" className={labelClass}>
                  <Upload className="w-4 h-4 text-primary" />
                  Updated Resume
                </label>
                <input
                  id="apply-resume"
                  ref={fileInputRef}
                  type="file"
                  accept={RESUME_ACCEPT_ATTRIBUTE}
                  onChange={handleFileChange}
                  required
                  disabled={isLoading}
                  className="w-full text-sm text-muted-foreground rounded-xl border border-border bg-card file:mr-4 file:py-3 file:px-5 file:rounded-l-xl file:border-0 file:bg-primary/15 file:text-primary file:font-semibold file:cursor-pointer hover:file:bg-primary/25 transition-colors cursor-pointer disabled:opacity-70"
                />
                <p className="card-desc mt-2 text-xs">
                  {resume ? (
                    <span className="text-primary font-semibold">
                      {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  ) : (
                    "PDF, DOC or DOCX — up to 5MB"
                  )}
                </p>
              </div>

              <div>
                <label htmlFor="apply-message" className={labelClass}>
                  <FileText className="w-4 h-4 text-primary" />
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  id="apply-message"
                  rows={3}
                  placeholder="Key skills, relevant project experience, or anything else we should know."
                  value={fields.message}
                  onChange={setField("message")}
                  disabled={isLoading}
                  className={`${inputClass} resize-y min-h-[90px]`}
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-primary/10 transition-colors font-medium disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      Sending... <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return typeof document !== "undefined" && document.body ? createPortal(modalContent, document.body) : null
}
