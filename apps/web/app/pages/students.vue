<script setup lang="ts">
import type { Student } from '~/types/domain'

const { getStudents, createStudent } = useGradeCloudApi()
const students = ref<Student[]>([])
const form = reactive({ full_name: '', email: '' })
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const notice = ref('')

async function load() {
  loading.value = true
  try {
    students.value = await getStudents()
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
    await createStudent({ full_name: form.full_name, email: form.email })
    form.full_name = ''
    form.email = ''
    notice.value = 'Alumno guardado correctamente.'
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
        Alumnos
      </h1>
      <p class="mt-2 text-sm text-slate-500">
        Registra alumnos ficticios para la práctica.
      </p>
    </div>
    <section class="card">
      <h2 class="mb-4 text-lg font-bold">
        Nuevo alumno
      </h2>
      <form class="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end" @submit.prevent="save">
        <label class="block text-sm font-medium">
          Nombre completo
          <input v-model="form.full_name" class="form-control mt-2" required minlength="2" maxlength="120" placeholder="Ana Torres">
        </label>
        <label class="block text-sm font-medium">
          Correo ficticio
          <input v-model="form.email" class="form-control mt-2" type="email" required maxlength="180" placeholder="ana@example.test">
        </label>
        <button class="btn-primary" type="submit" :disabled="saving">
          {{ saving ? 'Guardando...' : 'Agregar alumno' }}
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
          Alumnos registrados ({{ students.length }})
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
                Nombre
              </th>
              <th class="table-cell">
                Correo
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id" class="border-t border-slate-100">
              <td class="table-cell">
                {{ student.id }}
              </td>
              <td class="table-cell font-semibold">
                {{ student.full_name }}
              </td>
              <td class="table-cell">
                {{ student.email }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="students.length === 0" class="p-5 text-sm text-slate-500">
          Sin alumnos registrados.
        </p>
      </div>
    </section>
  </div>
</template>
