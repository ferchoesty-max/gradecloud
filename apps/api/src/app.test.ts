import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from './app.js'

const app = createApp()

describe('GradeCloud API', () => {
  it('GET /health devuelve estado OK', async () => {
    const response = await request(app).get('/health')
    expect(response.status).toBe(200)
    expect(response.body.status).toBe('ok')
  })

  it('POST /api/v1/students rechaza datos incorrectos', async () => {
    const response = await request(app)
      .post('/api/v1/students')
      .send({ full_name: 'A', email: 'invalido' })
    expect(response.status).toBe(400)
    expect(response.body.error.message).toBe('Datos inválidos')
  })

  it('POST /api/v1/grades valida el rango 0 a 100', async () => {
    const response = await request(app)
      .post('/api/v1/grades')
      .send({ student_id: 1, course_id: 1, score: 101 })
    expect(response.status).toBe(400)
  })

  it('GET /ruta-inexistente responde 404', async () => {
    const response = await request(app).get('/ruta-inexistente')
    expect(response.status).toBe(404)
  })
})
