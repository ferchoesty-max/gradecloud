export interface Student {
  id: number
  full_name: string
  email: string
}

export interface Course {
  id: number
  code: string
  title: string
}

export interface Grade {
  id: number
  student_id: number
  course_id: number
  score: number
  student_name: string
  course_title: string
  course_code: string
}

export interface CourseAverage {
  id: number
  code: string
  title: string
  total_grades: number
  average: number | null
}

export interface Summary {
  students: number
  courses: number
  grades: number
  average: number | null
  by_course: CourseAverage[]
}
