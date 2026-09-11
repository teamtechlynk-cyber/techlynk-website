"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Users, Mail, FileText, Loader2 } from "lucide-react"

export type JourneyFormData = {
  teamCount: string
  email: string
  jobDescriptions: string
}

type JourneyFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: JourneyFormData) => void
}

export default function JourneyFormModal({ isOpen, onClose, onSubmit }: JourneyFormModalProps) {
  const [teamCount, setTeamCount] = useState("")
  const [email, setEmail] = useState("")
  const [jobDescriptions, setJobDescriptions] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamCount, email, jobDescriptions }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit")
      }

      onSubmit?.({ teamCount, email, jobDescriptions })
      setStatus("success")
      setTeamCount("")
      setEmail("")
      setJobDescriptions("")
      setTimeout(() => {
        setStatus("idle")
        onClose()
      }, 1500)
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Failed to submit")
    }
  }

  const handleClose = () => {
    setTeamCount("")
    setEmail("")
    setJobDescriptions("")
    setStatus("idle")
    setErrorMsg("")
    onClose()
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-lg glass-primary rounded-2xl border border-primary/30 shadow-2xl shadow-primary/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="journey-form-title"
      >
        <div className="relative p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 id="journey-form-title" className="section-heading !mb-0 text-2xl sm:text-3xl gradient-text-glow">
              Start Your Journey
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/15 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {status === "success" ? (
            <div className="py-12 text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/15 mb-4">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="section-body text-foreground font-medium">Thank you! We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {status === "error" && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}
              {/* Team count / members */}
              <div>
                <label htmlFor="team-count" className="flex items-center gap-2 label-small font-medium !normal-case mb-2">
                  <Users className="w-4 h-4 text-primary" />
                  Team size / Number of members
                </label>
                <input
                  id="team-count"
                  type="number"
                  min={1}
                  max={999}
                  placeholder="e.g. 5"
                  value={teamCount}
                  onChange={(e) => setTeamCount(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-70"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="journey-email" className="flex items-center gap-2 label-small font-medium !normal-case mb-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Email
                </label>
                <input
                  id="journey-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-70"
                />
              </div>

              {/* Job Descriptions */}
              <div>
                <label htmlFor="job-descriptions" className="flex items-center gap-2 label-small font-medium !normal-case mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Job Descriptions
                </label>
                <textarea
                  id="job-descriptions"
                  rows={4}
                  placeholder="Describe the roles or skills you need (e.g. Oracle Fusion Finance consultant, SCM specialist...)"
                  value={jobDescriptions}
                  onChange={(e) => setJobDescriptions(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-y min-h-[100px] disabled:opacity-70"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-primary/10 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      Submitting... <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return typeof document !== "undefined" && document.body
    ? createPortal(modalContent, document.body)
    : null
}
