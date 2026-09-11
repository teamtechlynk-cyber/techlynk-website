import {
  Bot,
  Briefcase,
  Cloud,
  Code2,
  Cog,
  Cpu,
  Database,
  Globe2,
  Layers,
  LineChart,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Users,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

/** Icon choices offered in the admin UI, keyed by name so they can be stored as plain strings in jobs.json. */
export const JOB_ICONS: Record<string, LucideIcon> = {
  Bot,
  Briefcase,
  Cloud,
  Code2,
  Cog,
  Cpu,
  Database,
  Globe2,
  Layers,
  LineChart,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Terminal,
  Users,
  Wrench,
}

export type JobIconName = keyof typeof JOB_ICONS
export const JOB_ICON_NAMES = Object.keys(JOB_ICONS) as JobIconName[]

export const DEFAULT_JOB_ICON: JobIconName = "Briefcase"

export function isJobIconName(value: string): value is JobIconName {
  return value in JOB_ICONS
}
