import { NextResponse } from "next/server"
import { z } from "zod"
import { isAdminRequest } from "@/lib/admin-auth"
import { createJobId, readJobs, writeJobs, type JobOpening } from "@/lib/jobs"
import { JOB_ICON_NAMES } from "@/lib/job-icons"

export const dynamic = "force-dynamic"

const jobInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(120).trim(),
  icon: z.enum(JOB_ICON_NAMES as [string, ...string[]]),
  category: z.string().min(1, "Category is required").max(120).trim(),
  desc: z.string().min(1, "Description is required").max(2000).trim(),
  extraTags: z.array(z.string().min(1).max(60).trim()).max(6).default([]),
  active: z.boolean().default(true),
})

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const jobs = await readJobs()
  return NextResponse.json({ jobs })
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = jobInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join("; ") },
      { status: 400 }
    )
  }

  const jobs = await readJobs()
  const newJob: JobOpening = { id: createJobId(), ...parsed.data }
  jobs.push(newJob)
  await writeJobs(jobs)
  return NextResponse.json({ job: newJob }, { status: 201 })
}
