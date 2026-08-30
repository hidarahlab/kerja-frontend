import { apiRequest } from './client'

export interface AssigneeDTO {
  id: number
  name: string
  initials: string
}

export interface ProjectDTO {
  id: number
  companyId: number
  code: string
  name: string
  description: string
  category: string
  progress: number
  deadline: string
  status: string
  assignees: AssigneeDTO[]
  createdAt: string
  updatedAt: string
}

export interface ProjectsPage {
  content: ProjectDTO[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export const projectsApi = {
  getAll: (page = 0, size = 10) =>
    apiRequest<ProjectsPage>(
      `/projects?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  getById: (id: number) => apiRequest<ProjectDTO>(`/projects/${id}`),

  getByCompany: (companyId: number, page = 0, size = 10) =>
    apiRequest<ProjectsPage>(
      `/projects/company/${companyId}?page=${page}&size=${size}&sort=createdAt,desc`,
    ),

  search: (keyword: string, page = 0, size = 10) =>
    apiRequest<ProjectsPage>(
      `/projects/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    ),

  create: (data: Partial<ProjectDTO>) =>
    apiRequest<ProjectDTO>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<ProjectDTO>) =>
    apiRequest<ProjectDTO>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
}
