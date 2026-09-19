import { apiRequest } from './client'

export interface TaskDTO {
  id: number
  companyId: number
  projectId: number
  code: string
  title: string
  description: string
  dueDate: string
  status: string
  category: string
  priority: string
  // Boolean, tapi null untuk task lama yang dibuat sebelum kolom ini ada.
  myDay: boolean | null
  progress: number
  // Diisi backend otomatis saat status berpindah jadi "done" — null kalau
  // belum pernah selesai atau sudah dibuka lagi.
  completedAt: string | null
  assigneeId: number | null
  assigneeInitials: string
  assigneeName: string
  createdAt: string
  updatedAt: string
}

export interface TasksPage {
  content: TaskDTO[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface TaskChecklistDTO {
  id: number
  taskId: number
  text: string
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface TaskCommentDTO {
  id: number
  taskId: number
  authorId: number
  authorName: string
  authorPosition: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface TaskActivityDTO {
  id: number
  taskId: number
  userInitials: string
  action: string
  createdAt: string
}

export interface TaskAttachmentDTO {
  id: number
  taskId: number
  fileName: string
  fileSize: number
  filePath: string
  createdAt: string
}

export const tasksApi = {
  getAll: (page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getById: (id: number) => apiRequest<TaskDTO>(`/tasks/${id}`),

  getByCompany: (companyId: number, page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks/company/${companyId}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getByProject: (projectId: number, page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks/project/${projectId}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getByStatus: (status: string, page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks/status/${status}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getByCompanyAndStatus: (
    companyId: number,
    status: string,
    page = 0,
    size = 50,
  ) =>
    apiRequest<TasksPage>(
      `/tasks/company/${companyId}/status/${status}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getByAssignee: (assigneeId: number, page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks/assignee/${assigneeId}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  search: (keyword: string, page = 0, size = 50) =>
    apiRequest<TasksPage>(
      `/tasks/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    ),

  create: (data: Partial<TaskDTO>) =>
    apiRequest<TaskDTO>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<TaskDTO>) =>
    apiRequest<TaskDTO>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  getChecklist: (taskId: number) =>
    apiRequest<TaskChecklistDTO[]>(`/tasks/${taskId}/checklist`),

  getComments: (taskId: number) =>
    apiRequest<TaskCommentDTO[]>(`/tasks/${taskId}/comments`),

  getActivities: (taskId: number) =>
    apiRequest<TaskActivityDTO[]>(`/tasks/${taskId}/activities`),

  getAttachments: (taskId: number) =>
    apiRequest<TaskAttachmentDTO[]>(`/tasks/${taskId}/attachments`),
}
