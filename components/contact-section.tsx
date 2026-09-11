"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react"

const inputClass = "w-full px-5 py-4 bg-card border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-base sm:text-lg hover:border-primary/50"

export default function ContactSection() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message")
    }
  }
  return (
    <section id="contact" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/12 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/12 rounded-full blur-[120px] animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 rounded-full blur-[150px] animate-pulse-glow"></div>
      </div>
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="section-eyebrow">Contact</span>
          </div>
            <h2 className="section-title">
              <span className="gradient-text-glow">Get Your Oracle Fusion Expert</span>
            </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-start">
          <div className="animate-slide-up">
            <p className="section-body mb-12 max-w-none">
              Share your Oracle Fusion resource requirements and we'll match you with pre-vetted specialists. Get started with a free consultation to discuss your staffing needs.
            </p>

            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start gap-5 glass-primary p-6 rounded-2xl border border-border group hover:border-primary/50 hover:scale-105 transition-all duration-500">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                  <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                </div>
                <div>
                  <h4 className="card-title !mb-2">Phone</h4>
                  <a href="tel:+919573787824" className="text-muted-foreground hover:text-primary text-lg sm:text-xl transition-colors font-medium">
                    +91 95737 87824
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-5 glass-primary p-6 rounded-2xl border border-border group hover:border-primary/50 hover:scale-105 transition-all duration-500">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                </div>
                <div>
                  <h4 className="card-title !mb-2">Email</h4>
                  <a
                    href="mailto:support@techlynk.co"
                    className="text-muted-foreground hover:text-primary text-lg sm:text-xl transition-colors font-medium"
                  >
                    support@techlynk.co
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-5 glass-primary p-6 rounded-2xl border border-border group hover:border-primary/50 hover:scale-105 transition-all duration-500">
                <div className="p-3 bg-primary/15 rounded-xl group-hover:bg-primary/25 transition-colors">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                </div>
                <div>
                  <h4 className="card-title !mb-2">Location</h4>
                  <p className="text-muted-foreground text-lg sm:text-xl font-medium">Hyderabad, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Contact Form */}
          <div className="glass-primary border border-border rounded-3xl p-8 sm:p-10 md:p-12 animate-slide-up shadow-2xl shadow-primary/5">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {status === "success" && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle size={24} className="flex-shrink-0" />
                  <p className="font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300">
                  <p className="font-medium">{errorMsg}</p>
                </div>
              )}
              <div>
                <label className="block card-title !mb-3">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block card-title !mb-3">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block card-title !mb-3">Resource Requirements</label>
                <textarea
                  name="message"
                  placeholder="Tell us about your Oracle Fusion resource needs - module, skills required, experience level, engagement model..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={status === "loading"}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-8 py-4.5 bg-primary hover:opacity-95 disabled:opacity-70 disabled:cursor-not-allowed text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-500 text-lg sm:text-xl hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {status === "loading" ? (
                  <>
                    Sending... <Loader2 size={20} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Request Resource <Send size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
