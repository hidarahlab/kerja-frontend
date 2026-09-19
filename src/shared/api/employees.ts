import { apiRequest } from './client'

export interface EmployeeDTO {
  id: number
  companyId: number
  companyName: string
  name: string
  email: string
  phone: string
  role: string
  position: string
  department: string
  hireDate: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface EmployeesPage {
  content: EmployeeDTO[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export const employeesApi = {
  getAll: (page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees?page=${page}&size=${size}`,
    ),

  getById: (id: number) => apiRequest<EmployeeDTO>(`/employees/${id}`),

  getByEmail: (email: string) =>
    apiRequest<EmployeeDTO>(`/employees/email/${encodeURIComponent(email)}`),

  getByCompany: (companyId: number, page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees/company/${companyId}?page=${page}&size=${size}`,
    ),

  getByRole: (role: string, page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees/role/${role}?page=${page}&size=${size}`,
    ),

  getByStatus: (status: string, page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees/status/${status}?page=${page}&size=${size}`,
    ),

  search: (keyword: string, page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    ),

  searchByCompany: (companyId: number, keyword: string, page = 0, size = 50) =>
    apiRequest<EmployeesPage>(
      `/employees/company/${companyId}/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
    ),
}
