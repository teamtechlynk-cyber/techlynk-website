"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogOut, Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JOB_ICON_NAMES, JOB_ICONS, DEFAULT_JOB_ICON, type JobIconName } from "@/lib/job-icons"
import type { JobOpening } from "@/lib/jobs"

type DraftJob = {
  title: string
  icon: JobIconName
  category: string
  desc: string
  /** Comma-separated in the form; split into an array on submit. */
  extraTags: string
  active: boolean
}

const EMPTY_DRAFT: DraftJob = {
  title: "",
  icon: DEFAULT_JOB_ICON,
  category: "",
  desc: "",
  extraTags: "",
  active: true,
}

function toDraft(job: JobOpening): DraftJob {
  return {
    title: job.title,
    icon: job.icon,
    category: job.category,
    desc: job.desc,
    extraTags: job.extraTags.join(", "),
    active: job.active,
  }
}

export default function AdminJobsManager() {
  const router = useRouter()
  const [jobs, setJobs] = useState<JobOpening[] | null>(null)
  const [loadError, setLoadError] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null) // null = not editing, "" = new role
  const [draft, setDraft] = useState<DraftJob>(EMPTY_DRAFT)
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadJobs = useCallback(async () => {
    const res = await fetch("/api/admin/jobs")
    if (res.status === 401) {
      router.push("/admin/login?from=/admin")
      return
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setLoadError(data.error || "Failed to load job openings")
      return
    }
    setJobs(data.jobs)
  }, [router])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const startEdit = (job: JobOpening) => {
    setEditingId(job.id)
    setDraft(toDraft(job))
    setFormError("")
  }

  const startNew = () => {
    setEditingId("")
    setDraft(EMPTY_DRAFT)
    setFormError("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setFormError("")
  }

  const submitDraft = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormError("")
    const payload = {
      title: draft.title,
      icon: draft.icon,
      category: draft.category,
      desc: draft.desc,
      extraTags: draft.extraTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      active: draft.active,
    }
    try {
      const isNew = editingId === ""
      const res = await fetch(isNew ? "/api/admin/jobs" : `/api/admin/jobs/${editingId}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.status === 401) {
        router.push("/admin/login?from=/admin")
        return
      }
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setFormError(data.error || "Failed to save")
        return
      }
      await loadJobs()
      cancelEdit()
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (job: JobOpening) => {
    setBusyId(job.id)
    setJobs((prev) => prev?.map((j) => (j.id === job.id ? { ...j, active: !j.active } : j)) ?? prev)
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !job.active }),
      })
      if (res.status === 401) {
        router.push("/admin/login?from=/admin")
        return
      }
      if (!res.ok) {
        // Revert the optimistic flip if the server rejected it.
        setJobs((prev) => prev?.map((j) => (j.id === job.id ? { ...j, active: job.active } : j)) ?? prev)
      }
    } finally {
      setBusyId(null)
    }
  }

  const deleteJob = async (job: JobOpening) => {
    if (!confirm(`Delete "${job.title}"? This can't be undone.`)) return
    setBusyId(job.id)
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" })
      if (res.status === 401) {
        router.push("/admin/login?from=/admin")
        return
      }
      if (res.ok) {
        setJobs((prev) => prev?.filter((j) => j.id !== job.id) ?? prev)
      }
    } finally {
      setBusyId(null)
    }
  }

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Job Openings</h1>
          <p className="text-muted-foreground mt-1">
            Toggle roles on/off or edit them — changes show on the live site immediately, no deploy needed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={startNew} size="sm">
            <Plus className="w-4 h-4" /> Add Role
          </Button>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="w-4 h-4" /> Log Out
          </Button>
        </div>
      </div>

      {loadError && editingId === null && <p className="text-sm text-destructive">{loadError}</p>}

      {editingId !== null && (
        <form onSubmit={submitDraft} className="card-premium p-6 flex flex-col gap-4 border border-primary/30">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-foreground">{editingId === "" ? "New Role" : "Edit Role"}</h2>
            <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                required
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              required
              rows={3}
              value={draft.desc}
              onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Icon</Label>
              <Select
                value={draft.icon}
                onValueChange={(value) => setDraft((d) => ({ ...d, icon: value as JobIconName }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {JOB_ICON_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="extraTags">Extra tags (comma-separated)</Label>
              <Input
                id="extraTags"
                placeholder="e.g. Onshore & Offshore"
                value={draft.extraTags}
                onChange={(e) => setDraft((d) => ({ ...d, extraTags: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={draft.active}
              onCheckedChange={(checked) => setDraft((d) => ({ ...d, active: checked }))}
            />
            <Label>Active (visible on the site)</Label>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </Button>
            <Button type="button" variant="outline" onClick={cancelEdit}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {jobs === null && !loadError && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading roles…
        </div>
      )}

      {jobs !== null && jobs.length === 0 && (
        <p className="text-muted-foreground py-8 text-center">No roles yet. Add one to get started.</p>
      )}

      <div className="flex flex-col gap-3">
        {jobs?.map((job) => {
          const Icon = JOB_ICONS[job.icon] ?? JOB_ICONS[DEFAULT_JOB_ICON]
          return (
            <div key={job.id} className="card-premium p-5 flex items-center gap-4 flex-wrap sm:flex-nowrap">
              <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {job.category}
                </p>
                <p className="font-bold text-foreground">{job.title}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={job.active} disabled={busyId === job.id} onCheckedChange={() => toggleActive(job)} />
                <span className="text-sm text-muted-foreground w-14">{job.active ? "Active" : "Closed"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="icon-sm" onClick={() => startEdit(job)} aria-label="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => deleteJob(job)}
                  disabled={busyId === job.id}
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
