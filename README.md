# GradeCloud

Sistema de gestión académica y control de calificaciones desarrollado para la materia de Cómputo en la Nube.

- **Estudiante:** Fernando Daniel Tolentino Uribe
- **NUA:** 395108
- **Universidad:** Universidad de Guanajuato (DICIS)
- **Materia:** Cómputo en la Nube

---

## Arquitectura

- **Frontend:** Nuxt 4 (SPA), Vue 3, Tailwind CSS 4, TypeScript.
- **Backend:** Node.js 24, Express 5, PostgreSQL (`pg`), Zod 4, Vitest, Supertest.
- **Base de Datos:** PostgreSQL 17 (Docker Compose en desarrollo local).
- **Despliegue Nube:** Netlify (Frontend) y Render / Neon (Backend & PostgreSQL).

---

## Ejecución y Desarrollo Local

### 1. Variables de entorno

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 2. Base de datos local (PostgreSQL en Docker)

```bash
docker compose up -d postgres
```

### 3. Migraciones y datos iniciales

```bash
npm run db:migrate
npm run db:seed
```

### 4. Iniciar servidores de desarrollo

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)
  - `/health`
  - `/ready`
  - `/api/v1/summary`
  - `/api/v1/students`
  - `/api/v1/courses`
  - `/api/v1/grades`

---

## Pruebas y Validación

```bash
# Pruebas automatizadas de API
npm test

# Verificación de tipos TypeScript
npm run typecheck

# Compilación estática de Nuxt
npm run build:web

# Smoke test HTTP E2E
npm run smoke
```
