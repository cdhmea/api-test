import fastify from "fastify"
import fastifyStatic from "@fastify/static"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.join(__filename, '..')

const app = fastify()
const port = 3000

app.register(fastifyStatic, {
    root: path.join(__dirname, 'public')
})

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

app.get('/api', (req, res) => {
    res.send({message: 'Запрос прошел успешно'})
})

app.listen({ port }, () => {
    console.log('Сервак запущен')
})