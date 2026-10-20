import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { pool } from '../db.js'

try {
  const sql = await readFile(new URL('../../sql/seed.sql', import.meta.url), 'utf8')
  await pool.query(sql)
  console.log('Datos de ejemplo cargados correctamente')
} catch (error) {
  console.error('Error cargando datos:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
