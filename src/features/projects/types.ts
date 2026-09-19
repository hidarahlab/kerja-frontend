export type Project = {
  id: string
  code: string
  name: string
  description: string
  category: string
  progress: number
  assignees: Array<{ initials: string; name: string }>
  deadline: Date
  /** "ACTIVE" atau "COMPLETED" — lihat src/shared/lib/projectStatus.ts. */
  status: string
}
