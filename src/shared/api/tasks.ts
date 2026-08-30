import { apiRequest } from './client'

export interface TaskDTO {
  id: number
  companyId: number
  code: string
  title: string
  description: string
  dueDate: string
  status: string
  category: string
  progress: number
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
}
