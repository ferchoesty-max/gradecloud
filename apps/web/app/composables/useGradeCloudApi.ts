import type { Course, Grade, Student, Summary } from '~/types/domain'

interface ApiResponse<T> { data: T }

type HttpMethod = 'GET' | 'POST' | 'DELETE'

export function useGradeCloudApi() {
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase).replace(/\/$/, '')

  async function call<T>(path: string, method: HttpMethod = 'GET', body?: Record<string, any>) {
    const response = await $fetch<ApiResponse<T>>(`${apiBase}/api/v1${path}`, { method, body })
    return response.data
  }

  return {
    getStudents: () => call<Student[]>('/students'),
    createStudent: (data: { full_name: string; email: string }) => call<Student>('/students', 'POST', data),
    getCourses: () => call<Course[]>('/courses'),
    createCourse: (data: { code: string; title: string }) => call<Course>('/courses', 'POST', data),
    getGrades: () => call<Grade[]>('/grades'),
    saveGrade: (data: { student_id: number; course_id: number; score: number }) => call<Grade>('/grades', 'POST', data),
    deleteGrade: (id: number) => $fetch<void>(`${apiBase}/api/v1/grades/${id}`, { method: 'DELETE' }),
    getSummary: () => call<Summary>('/summary'),
  }
}

export function readableError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = (error as { data?: { error?: { message?: string } } }).data
    if (data?.error?.message) return data.error.message
  }
  return error instanceof Error ? error.message : 'No fue posible comunicarse con la API'
}
