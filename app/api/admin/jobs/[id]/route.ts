import { NextResponse } from "next/server"
import { z } from "zod"
import { isAdminRequest } from "@/lib/admin-auth"
import { readJobs, writeJobs } from "@/lib/jobs"
import { JOB_ICON_NAMES } from "@/lib/job-icons"

export const dynamic = "force-dynamic"

const jobUpdateSchema = z.object({
  title: z.string().min(1).max(120).trim().optional(),
  icon: z.enum(JOB_ICON_NAMES as [string, ...string[]]).optional(),
  category: z.string().min(1).max(120).trim().optional(),
  desc: z.string().min(1).max(2000).trim().optional(),
  extraTags: z.array(z.string().min(1).max(60).trim()).max(6).optional(),
  active: z.boolean().optional(),
})

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = jobUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join("; ") },
      { status: 400 }
    )
  }

  const jobs = await readJobs()
  const index = jobs.findIndex((job) => job.id === id)
  if (index === -1) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  jobs[index] = { ...jobs[index], ...parsed.data }
  await writeJobs(jobs)
  return NextResponse.json({ job: jobs[index] })
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const jobs = await readJobs()
  const next = jobs.filter((job) => job.id !== id)
  if (next.length === jobs.length) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  await writeJobs(next)
  return NextResponse.json({ success: true })
}
