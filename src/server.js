import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastifyFormbody from "@fastify/formbody"
import pug from "pug"
import path from "path"
import { fileURLToPath } from "url"
import Database from "better-sqlite3"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = fastify()
const port = 3000
const db = new Database('database.db')

db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT)")

app.register(fastifyFormbody)

app.register(fastifyView, {
  engine: { pug },
  root: path.join(__dirname, 'views')
})

app.get('/', async (req, res) => {
  return res.redirect('/users')
})

app.get('/users', async (req, res) => {
  const users = db.prepare("SELECT * FROM users").all()
  return res.view('users.pug', { users })
})

app.get('/users/create', async (req, res) => {
  return res.view('create.pug')
})

app.post('/users', async (req, res) => {
  const { name, email } = req.body
  db.prepare("INSERT INTO users (name, email) VALUES (?, ?)").run(name, email)
  return res.redirect('/users')
})

app.post('/users/delete/:id', async (req, res) => {
  const { id } = req.params
  db.prepare("DELETE FROM users WHERE id = ?").run(id)
  return res.redirect('/users')
})

const start = async () => {
  try {
    await app.listen({ port })
    console.log('Сервер запущен на http://localhost:3000')
  } catch (err) {
    console.error(err)
  }
}

start()