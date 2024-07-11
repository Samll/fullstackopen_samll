require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person') 
const cors = require('cors')
app.use(express.static("dist"))
app.use(cors())
var morgan = require("morgan")
app.use(express.json())
app.use(morgan('tiny')) 
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('\t\tBody: :body',{skip: function (req,res) {return req.method !== "POST"}}))

//Start Phonetool data and endpoints
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
}) 

app.post('/api/persons', (request, response) => {
  const body = request.body 
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number missing' 
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson =>{
    response.json(savedPerson);
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number missing' 
    })
  }
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))

})
 

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person =>{
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error)) 
})

app.get("/info", (request,response, next) => {
    const dateMessage = new Date()
    Person.find({}).then(result => {  
      response.send(`<p>Phonebook has info for ${result.length} people</p><p>${dateMessage}</p>`)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error:"Unknown endpoint"})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)


const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})