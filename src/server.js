import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import fastifyView from "@fastify/view"
import fastifyFormbody from "@fastify/formbody"
import pug from "pug"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()
const port = 3000

let users = [
  { id: 1, name: "Иван Иванов", email: "ivan@example.com" },
  { id: 2, name: "Мария Сидорова", email: "maria@example.com" }
]

app.register(fastifyFormbody)

app.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/'
})

app.register(fastifyView, {
  engine: {
    pug: pug
  },
  root: path.join(__dirname, 'views')
})

app.get('/', async (req, res) => {
  return res.redirect('/users')
})

app.get('/users', async (req, res) => {
  return res.view('users.pug', { users })
})

app.get('/users/create', async (req, res) => {
  return res.view('create.pug')
})

app.post('/users', async (req, res) => {
  const { name, email } = req.body
  const newUser = {
    id: users.length + 1,
    name,
    email
  }
  users.push(newUser)
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