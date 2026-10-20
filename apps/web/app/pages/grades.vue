<script setup lang="ts">
import type { Student, Course, Grade } from '~/types/domain'

const api = useGradeCloudApi()
const students = ref<Student[]>([])
const courses = ref<Course[]>([])
const grades = ref<Grade[]>([])
const form = reactive({ student_id: '', course_id: '', score: '' })
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const notice = ref('')

async function load() {
  loading.value = true
  try {
    const [studentsResult, coursesResult, gradesResult] = await Promise.all([
      api.getStudents(), api.getCourses(), api.getGrades(),
    ])
    students.value = studentsResult
    courses.value = coursesResult
    grades.value = gradesResult
  } catch (error) {
    errorMessage.value = readableError(error)
  } finally {
    loading.value = false
  }
}

async function save() {
  errorMessage.value = ''
  notice.value = ''
  saving.value = true
  try {
    await api.saveGrade({
      student_id: Number(form.student_id),
      course_id: Number(form.course_id),
      score: Number(form.score),
    })
    form.student_id = ''
    form.course_id = ''
    form.score = ''
    notice.value = 'Calificación guardada. Si ya existía, fue actualizada.'
    await load()
  } catch (error) {
    errorMessage.value = readableError(error)
  } finally {
    saving.value = false
  }
}

function edit(grade: Grade) {
  form.student_id = String(grade.student_id)
  form.course_id = String(grade.course_id)
  form.score = String(grade.score)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function remove(grade: Grade) {
  if (!window.confirm(`¿Eliminar la calificación de ${grade.student_name}?`)) return
  errorMessage.value = ''
  notice.value = ''
  try {
    await api.deleteGrade(grade.id)
    notice.value = 'Calificación eliminada.'
    await load()
  } catch (error) {
    errorMessage.value = readableError(error)
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm font-semibold text-indigo-600">
        Evaluación
      </p>
      <h1 class="mt-1 text-3xl font-extrabold">
        Calificaciones
      </h1>
      <p class="mt-2 text-sm text-slate-500">
        Una calificación final por alumno y materia, escala 0–100.
      </p>
    </div>
    <section class="card">
      <h2 class="mb-4 text-lg font-bold">
        Registrar o actualizar calificación
      </h2>
      <form class="grid gap-4 md:grid-cols-[1fr_1fr_140px_auto] md:items-end" @submit.prevent="save">
        <label class="block text-sm font-medium">
          Alumno
          <select v-model="form.student_id" class="form-control mt-2" required>
            <option value="" disabled>
              Seleccionar alumno
            </option>
            <option v-for="student in students" :key="student.id" :value="String(student.id)">
              {{ student.full_name }}
            </option>
          </select>
        </label>
        <label class="block text-sm font-medium">
          Materia
          <select v-model="form.course_id" class="form-control mt-2" required>
            <option value="" disabled>
              Seleccionar materia
            </option>
            <option v-for="course in courses" :key="course.id" :value="String(course.id)">
              {{ course.code }}
            </option>
          </select>
        </label>
        <label class="block text-sm font-medium">
          Puntuación
          <input v-model="form.score" class="form-control mt-2" type="number" min="0" max="100" step="0.01" required placeholder="90">
        </label>
        <button class="btn-primary" type="submit" :disabled="saving || students.length === 0 || courses.length === 0">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </form>
      <p v-if="!loading && (students.length === 0 || courses.length === 0)" class="mt-3 text-sm text-amber-700">
        Primero registra al menos un alumno y una materia.
      </p>
    </section>
    <p v-if="errorMessage" role="alert" class="rounded-xl bg-red-50 p-3 text-sm text-red-700">
      {{ errorMessage }}
    </p>
    <p v-if="notice" role="status" class="rounded-xl bg-green-50 p-3 text-sm text-green-700">
      {{ notice }}
    </p>
    <section class="card overflow-hidden p-0">
      <div class="border-b border-slate-200 p-5">
        <h2 class="font-bold">
          Registro de calificaciones ({{ grades.length }})
        </h2>
      </div>
      <p v-if="loading" class="p-5 text-sm text-slate-500">
        Cargando...
      </p>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="table-head">
            <tr>
              <th class="table-cell">
                Alumno
              </th>
              <th class="table-cell">
                Materia
              </th>
              <th class="table-cell">
                Calificación
              </th>
              <th class="table-cell">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="grade in grades" :key="grade.id" class="border-t border-slate-100">
              <td class="table-cell font-semibold">
                {{ grade.student_name }}
              </td>
              <td class="table-cell">
                {{ grade.course_code }} · {{ grade.course_title }}
              </td>
              <td class="table-cell">
                <span class="rounded-full px-3 py-1 font-semibold" :class="grade.score >= 70 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
                  {{ grade.score }}
                </span>
              </td>
              <td class="table-cell">
                <div class="flex gap-3">
                  <button type="button" class="font-semibold text-indigo-600 hover:underline" @click="edit(grade)">
                    Editar
                  </button>
                  <button type="button" class="font-semibold text-red-600 hover:underline" @click="remove(grade)">
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="grades.length === 0" class="p-5 text-sm text-slate-500">
          Aún no hay calificaciones.
        </p>
      </div>
    </section>
  </div>
</template>
