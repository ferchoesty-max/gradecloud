<script setup lang="ts">
const route = useRoute()
const navigation = [
  { to: '/', title: 'Dashboard', symbol: '▦' },
  { to: '/students', title: 'Alumnos', symbol: '♙' },
  { to: '/courses', title: 'Materias', symbol: '▤' },
  { to: '/grades', title: 'Calificaciones', symbol: '◈' },
]
</script>

<template>
  <div class="min-h-screen lg:flex">
    <aside class="bg-slate-950 p-5 text-white lg:min-h-screen lg:w-64 lg:shrink-0">
      <NuxtLink to="/" class="mb-8 flex items-center gap-3">
        <span class="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 text-xl font-black">
          G
        </span>
        <span>
          <strong class="block text-xl tracking-tight">
            GradeCloud
          </strong>
          <small class="text-xs text-slate-400">
            Campus · Demo académica
          </small>
        </span>
      </NuxtLink>
      <nav class="flex gap-2 overflow-x-auto lg:flex-col" aria-label="Navegación principal">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition"
          :class="route.path === item.to ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
        >
          <span class="text-lg">
            {{ item.symbol }}
          </span>
          {{ item.title }}
        </NuxtLink>
      </nav>
      <div class="mt-10 hidden rounded-xl border border-slate-800 p-4 text-xs leading-relaxed text-slate-400 lg:block">
        Proyecto educativo: Nuxt 4, Node.js, PostgreSQL y nube.
      </div>
    </aside>
    <main class="min-w-0 flex-1">
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Panel académico
          </p>
          <p class="mt-1 text-sm text-slate-500">
            Gestión y análisis de calificaciones
          </p>
        </div>
        <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Proyecto nube
        </span>
      </header>
      <div class="mx-auto max-w-6xl p-5 md:p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
