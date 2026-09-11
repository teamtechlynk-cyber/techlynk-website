import { promises as fs } from "fs"
import path from "path"
import { randomUUID } from "crypto"
import type { JobIconName } from "@/lib/job-icons"

export type JobOpening = {
  id: string
  title: string
  icon: JobIconName
  category: string
  desc: string
  extraTags: string[]
  active: boolean
}

const DEFAULT_DATA_FILE = path.join(process.cwd(), "data", "jobs.json")

/**
 * Where job listings live. MUST point outside the deployed code directory in
 * production (e.g. /opt/techlynk-data/jobs.json, set via JOBS_DATA_FILE in
 * /etc/techlynk.env) — a deploy replaces the whole app directory, and a file
 * left under it would be wiped on the next deploy.
 */
function dataFilePath(): string {
  return process.env.JOBS_DATA_FILE || DEFAULT_DATA_FILE
}

/**
 * Seed data mirrors the 5 roles that used to be hardcoded in
 * components/hiring-openings.tsx, so the site looks identical to before
 * until someone touches the admin panel.
 */
const SEED_JOBS: JobOpening[] = [
  {
    id: "agentic-ai",
    title: "Agentic AI",
    icon: "Bot",
    category: "AI & Automation",
    desc: "Design and ship autonomous agent workflows, LLM integrations, and intelligent automation for enterprise systems.",
    extraTags: [],
    active: true,
  },
  {
    id: "java-full-stack",
    title: "Java Full Stack Developer",
    icon: "Code2",
    category: "Application Development",
    desc: "Build end-to-end enterprise applications across Java, Spring Boot, and modern front-end frameworks.",
    extraTags: [],
    active: true,
  },
  {
    id: "mainframe",
    title: "Mainframe Developer",
    icon: "Server",
    category: "Legacy & Modernization",
    desc: "Support, enhance, and modernize mission-critical mainframe applications and batch processing systems.",
    extraTags: [],
    active: true,
  },
  {
    id: "data-engineer",
    title: "Data Engineer",
    icon: "Database",
    category: "Data & Analytics",
    desc: "Build and optimize data pipelines, warehousing, and analytics platforms. Open for both onshore and offshore engagements.",
    extraTags: ["Onshore & Offshore"],
    active: true,
  },
  {
    id: "azure-devops",
    title: "Azure DevOps Engineer",
    icon: "Cloud",
    category: "Cloud & DevOps",
    desc: "Own CI/CD pipelines, infrastructure as code, and release automation across the Azure ecosystem.",
    extraTags: [],
    active: true,
  },
]

async function ensureFile(filePath: string): Promise<void> {
  try {
    await fs.access(filePath)
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, JSON.stringify(SEED_JOBS, null, 2))
  }
}

export async function readJobs(): Promise<JobOpening[]> {
  const filePath = dataFilePath()
  await ensureFile(filePath)
  try {
    const raw = await fs.readFile(filePath, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as JobOpening[]) : SEED_JOBS
  } catch (error) {
    console.error("Failed to read jobs data file:", error)
    return SEED_JOBS
  }
}

/** Atomic write (temp file + rename) so a crash mid-write can't corrupt the data file. */
export async function writeJobs(jobs: JobOpening[]): Promise<void> {
  const filePath = dataFilePath()
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`
  await fs.writeFile(tmpPath, JSON.stringify(jobs, null, 2))
  await fs.rename(tmpPath, filePath)
}

export async function getActiveJobs(): Promise<JobOpening[]> {
  const jobs = await readJobs()
  return jobs.filter((job) => job.active)
}

export function createJobId(): string {
  return randomUUID()
}
