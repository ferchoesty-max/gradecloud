import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { pool } from '../db.js'

try {
  const sql = await readFile(new URL('../../sql/schema.sql', import.meta.url), 'utf8')
  await pool.query(sql)
  console.log('Migración aplicada correctamente')
} catch (error) {
  console.error('Error en migración:', error)
  process.exitCode = 1
} finally {
  await pool.end()
}
