<script setup lang="ts">
import type { Course } from '~/types/domain'

const { getCourses, createCourse } = useGradeCloudApi()
const courses = ref<Course[]>([])
const form = reactive({ code: '', title: '' })
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const notice = ref('')

async function load() {
  loading.value = true
  try {
    courses.value = await getCourses()
  } catch (error) {
    errorMessage.value = readableError(error)
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  errorMessage.value = ''
  notice.value = ''
  try {
    await createCourse({ code: form.code, title: form.title })
    form.code = ''
    form.title = ''
    notice.value = 'Materia guardada correctamente.'
    await load()
  } catch (error) {
    errorMessage.value = readableError(error)
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="space-y-6">
    <div>
      <p class="text-sm font-semibold text-indigo-600">
        Catálogo académico
      </p>
      <h1 class="mt-1 text-3xl font-extrabold">
        Materias
      </h1>
      <p class="mt-2 text-sm text-slate-500">
        Crea materias y asigna su clave institucional de prueba.
      </p>
    </div>
    <section class="card">
      <h2 class="mb-4 text-lg font-bold">
        Nueva materia
      </h2>
      <form class="grid gap-4 md:grid-cols-[180px_1fr_auto] md:items-end" @submit.prevent="save">
        <label class="block text-sm font-medium">
          Clave
          <input v-model="form.code" class="form-control mt-2" required minlength="2" maxlength="20" placeholder="NUBE-101">
        </label>
        <label class="block text-sm font-medium">
          Nombre de materia
          <input v-model="form.title" class="form-control mt-2" required minlength="3" maxlength="120" placeholder="Cómputo en la Nube">
        </label>
        <button class="btn-primary" type="submit" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Agregar materia' }}
        </button>
      </form>
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
          Materias registradas ({{ courses.length }})
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
                ID
              </th>
              <th class="table-cell">
                Clave
              </th>
              <th class="table-cell">
                Materia
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="course in courses" :key="course.id" class="border-t border-slate-100">
              <td class="table-cell">
                {{ course.id }}
              </td>
              <td class="table-cell font-semibold text-indigo-600">
                {{ course.code }}
              </td>
              <td class="table-cell">
                {{ course.title }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="courses.length === 0" class="p-5 text-sm text-slate-500">
          Sin materias registradas.
        </p>
      </div>
    </section>
  </div>
</template>
