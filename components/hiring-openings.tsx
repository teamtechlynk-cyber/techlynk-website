"use client"

import { useState } from "react"
import { ArrowRight, Bot, Cloud, Code2, Database, Server, MapPin, Briefcase, Clock, Flame } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ApplyModal from "@/components/apply-modal"

const HIRING_EMAIL = "support@techlynk.co"

type Opening = {
  id: string
  title: string
  icon: LucideIcon
  category: string
  desc: string
  /** Extra chips shown alongside the standard Remote / Contractor / 7+ Years tags. */
  extraTags?: string[]
}

const openings: Opening[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    icon: Bot,
    category: "AI & Automation",
    desc: "Design and ship autonomous agent workflows, LLM integrations, and intelligent automation for enterprise systems.",
  },
  {
    id: "java-full-stack",
    title: "Java Full Stack Developer",
    icon: Code2,
    category: "Application Development",
    desc: "Build end-to-end enterprise applications across Java, Spring Boot, and modern front-end frameworks.",
  },
  {
    id: "mainframe",
    title: "Mainframe Developer",
    icon: Server,
    category: "Legacy & Modernization",
    desc: "Support, enhance, and modernize mission-critical mainframe applications and batch processing systems.",
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    icon: Database,
    category: "Data & Analytics",
    desc: "Build and optimize data pipelines, warehousing, and analytics platforms. Open for both onshore and offshore engagements.",
    extraTags: ["Onshore & Offshore"],
  },
  {
    id: "azure-devops",
    title: "Azure DevOps Engineer",
    icon: Cloud,
    category: "Cloud & DevOps",
    desc: "Own CI/CD pipelines, infrastructure as code, and release automation across the Azure ecosystem.",
  },
]

export default function HiringOpenings() {
  const [applyRole, setApplyRole] = useState<string | null>(null)
  const roleTitles = openings.map((role) => role.title)

  return (
    <section
      id="careers"
      className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px] animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/8 rounded-full blur-[150px] animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#06b6d4_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-block mb-4">
            <span className="section-eyebrow">We&apos;re Hiring</span>
          </div>
          <h2 className="section-title">
            <span className="gradient-text-glow">Active Job Openings</span>
          </h2>
          <p className="section-intro">
            High-priority contractor requirements open for immediate start. All roles are fully remote and require 7+
            years of hands-on experience.
          </p>
        </div>

        {/* Global requirement chips */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-14 sm:mb-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-primary border border-primary/25 text-sm sm:text-base font-semibold text-foreground">
            <MapPin size={18} className="text-primary" /> Remote
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-primary border border-primary/25 text-sm sm:text-base font-semibold text-foreground">
            <Briefcase size={18} className="text-primary" /> Contractor
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl glass-primary border border-primary/25 text-sm sm:text-base font-semibold text-foreground">
            <Clock size={18} className="text-primary" /> 7+ Years Experience
          </span>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/15 border border-primary/40 text-sm sm:text-base font-semibold text-primary">
            <Flame size={18} className="text-primary" /> Immediate Requirement
          </span>
        </div>

        {/* Openings grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {openings.map((role, index) => {
            const Icon = role.icon
            return (
              <div
                key={role.id}
                className="group card-premium card-glow flex flex-col animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/30 text-xs font-bold uppercase tracking-wider text-primary">
                    <Flame size={14} /> High Priority
                  </span>
                </div>

                <p className="label-small mb-3">{role.category}</p>
                <h3 className="card-title text-xl sm:text-2xl !mb-4 group-hover:gradient-text-glow transition-all duration-500">
                  {role.title}
                </h3>
                <p className="card-desc mb-6 flex-1">{role.desc}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold border border-border">
                    Remote
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold border border-border">
                    Contractor
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold border border-border">
                    7+ Years
                  </span>
                  {role.extraTags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setApplyRole(role.title)}
                  className="text-primary font-bold text-sm hover:text-accent flex items-center gap-2 group-hover:gap-4 transition-all duration-300"
                >
                  Apply Now <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-16 sm:mt-20 glass-primary rounded-3xl border border-primary/25 p-8 sm:p-12 text-center animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <h3 className="section-heading !mb-4 text-2xl sm:text-3xl md:text-4xl">
            <span className="gradient-text-glow">Don&apos;t see your role?</span>
          </h3>
          <p className="section-body mb-8 max-w-3xl mx-auto">
            Share your updated resume or profile and we&apos;ll match you with the right requirement as soon as it opens.
          </p>
          <button
            type="button"
            onClick={() => setApplyRole("")}
            className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-500 bg-primary text-primary-foreground hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95 border border-primary/40"
          >
            Send Your Resume <ArrowRight size={20} />
          </button>
          <p className="card-desc mt-6">
            Or email us directly at{" "}
            <a href={`mailto:${HIRING_EMAIL}`} className="text-primary font-semibold hover:text-accent transition-colors">
              {HIRING_EMAIL}
            </a>
          </p>
        </div>
      </div>

      <ApplyModal
        isOpen={applyRole !== null}
        onClose={() => setApplyRole(null)}
        role={applyRole ?? ""}
        roles={roleTitles}
      />
    </section>
  )
}
