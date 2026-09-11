import { NextResponse } from "next/server"
import { getActiveJobs } from "@/lib/jobs"

// Always read the data file fresh — this is what lets an admin toggle a
// role on/off and have it show up on the site without a rebuild/deploy.
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const jobs = await getActiveJobs()
    return NextResponse.json({ jobs })
  } catch (error) {
    console.error("Jobs API error:", error)
    return NextResponse.json({ error: "Failed to load job openings" }, { status: 500 })
  }
}
