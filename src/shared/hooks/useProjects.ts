import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, type ProjectDTO } from '@/shared/api/projects'

const PROJECTS_QUERY_KEY = ['projects']

export function useProjects(page = 0, size = 10) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, page, size],
    queryFn: () => projectsApi.getAll(page, size),
  })
}

export function useProject(id: number) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  })
}

export function useProjectsByCompany(companyId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, 'company', companyId, page, size],
    queryFn: () => projectsApi.getByCompany(companyId, page, size),
    enabled: !!companyId,
  })
}

export function useSearchProjects(keyword: string, page = 0, size = 10) {
  return useQuery({
    queryKey: [...PROJECTS_QUERY_KEY, 'search', keyword, page, size],
    queryFn: () => projectsApi.search(keyword, page, size),
    enabled: !!keyword,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ProjectDTO>) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<ProjectDTO>) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...PROJECTS_QUERY_KEY, id] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY })
    },
  })
}
