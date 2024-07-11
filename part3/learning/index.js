require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')
const cors = require('cors')
app.use(express.static("dist"))
app.use(cors())  


const requestLogger = (request, response, next) => {
  console.log("Method: ",request.method)
  console.log("Path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next()
}

app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hola a todo el mundo!</h1>')
})

app.get('/api/notes', (request, response) => {
  
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote =>{
    response.json(savedNote)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note =>{
    response.json(note)
  }) 
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error:"Endpoint no encontrado"})
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})