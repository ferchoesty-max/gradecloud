<script setup lang="ts">
import type { Summary } from '~/types/domain'

const { getSummary } = useGradeCloudApi()
const summary = ref<Summary | null>(null)
const loading = ref(true)
const errorMessage = ref('')

async function load() {
  loading.value = true
  errorMessage.value = ''
  try {
    summary.value = await getSummary()
  } catch (error) {
    errorMessage.value = readableError(error)
  } finally {
    loading.value = false
  }
}

onMounted(load)

const stats = computed(() => [
  { label: 'Alumnos', value: summary.value?.students ?? 0, icon: '👥' },
  { label: 'Materias', value: summary.value?.courses ?? 0, icon: '📚' },
  { label: 'Calificaciones', value: summary.value?.grades ?? 0, icon: '📝' },
  { label: 'Promedio general', value: summary.value?.average?.toFixed(1) ?? '—', icon: '📈' },
])
</script>

<template>
  <div class="space-y-7">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm font-semibold text-indigo-600">
          Resumen de la plataforma
        </p>
        <h1 class="mt-1 text-3xl font-extrabold tracking-tight">
          Dashboard
        </h1>
        <p class="mt-2 text-sm text-slate-500">
          Indicadores actualizados desde PostgreSQL.
        </p>
      </div>
      <button class="btn-primary" type="button" :disabled="loading" @click="load">
        Actualizar datos
      </button>
    </div>
    <p v-if="errorMessage" role="alert" class="rounded-xl bg-red-50 p-4 text-sm text-red-700">
      {{ errorMessage }}
    </p>
    <p v-if="loading" class="text-sm text-slate-500">
      Cargando indicadores...
    </p>
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="card">
          <div class="mb-5 text-2xl">
            {{ stat.icon }}
          </div>
          <p class="text-sm text-slate-500">
            {{ stat.label }}
          </p>
          <p class="mt-2 text-3xl font-extrabold">
            {{ stat.value }}
          </p>
        </div>
      </div>
      <section class="card">
        <h2 class="text-lg font-bold">
          Promedio por materia
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Escala de 0 a 100 · basado en calificaciones registradas
        </p>
        <div v-if="!summary?.by_course.length" class="py-8 text-sm text-slate-500">
          Primero registra una materia.
        </div>
        <div v-for="course in summary?.by_course ?? []" :key="course.id" class="mt-6">
          <div class="mb-2 flex justify-between gap-4 text-sm">
            <span class="font-medium">
              {{ course.code }} · {{ course.title }}
            </span>
            <span class="font-semibold">
              {{ course.average === null ? 'Sin calificaciones' : `${course.average.toFixed(1)} / 100` }}
            </span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full bg-indigo-500 transition-all" :style="{ width: `${course.average ?? 0}%` }" />
          </div>
          <p class="mt-1 text-xs text-slate-400">
            {{ course.total_grades }} calificación(es)
          </p>
        </div>
      </section>
      <div class="rounded-2xl bg-indigo-600 p-6 text-white">
        <h2 class="text-xl font-bold">
          Flujo completo en la nube
        </h2>
        <p class="mt-2 text-sm text-indigo-100">
          Nuxt 4 (Netlify) → Express 5 (Render) → PostgreSQL
        </p>
        <NuxtLink to="/grades" class="mt-4 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700">
          Registrar calificación →
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
