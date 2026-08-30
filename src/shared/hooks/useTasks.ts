import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi, type TaskDTO } from '@/shared/api/tasks'

const TASKS_QUERY_KEY = ['tasks']

export function useTasks(page = 0, size = 50) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, page, size],
    queryFn: () => tasksApi.getAll(page, size),
  })
}

export function useTask(id: number) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, id],
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  })
}

export function useTasksByCompany(companyId: number, page = 0, size = 50) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, 'company', companyId, page, size],
    queryFn: () => tasksApi.getByCompany(companyId, page, size),
    enabled: !!companyId,
  })
}

export function useTasksByStatus(status: string, page = 0, size = 50) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, 'status', status, page, size],
    queryFn: () => tasksApi.getByStatus(status, page, size),
    enabled: !!status,
  })
}

export function useTasksByCompanyAndStatus(
  companyId: number,
  status: string,
  page = 0,
  size = 50,
) {
  return useQuery({
    queryKey: [
      ...TASKS_QUERY_KEY,
      'company-status',
      companyId,
      status,
      page,
      size,
    ],
    queryFn: () => tasksApi.getByCompanyAndStatus(companyId, status, page, size),
    enabled: !!companyId && !!status,
  })
}

export function useTasksByAssignee(assigneeId: number, page = 0, size = 50) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, 'assignee', assigneeId, page, size],
    queryFn: () => tasksApi.getByAssignee(assigneeId, page, size),
    enabled: !!assigneeId,
  })
}

export function useSearchTasks(keyword: string, page = 0, size = 50) {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, 'search', keyword, page, size],
    queryFn: () => tasksApi.search(keyword, page, size),
    enabled: !!keyword,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<TaskDTO>) => tasksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

// id ikut di variabel mutate, bukan argumen hook, supaya satu instance bisa dipakai
// untuk task mana pun (mis. kartu yang sedang digeser di papan kanban).
export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TaskDTO> }) =>
      tasksApi.update(id, data),
    onSuccess: (_result, { id }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...TASKS_QUERY_KEY, id] })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}
