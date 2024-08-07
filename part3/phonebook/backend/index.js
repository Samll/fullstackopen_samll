const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static("dist"))
app.use(cors())
var morgan = require("morgan")
app.use(express.json())
app.use(morgan('tiny')) 
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan('\t\tBody: :body',{skip: function (req,res) {return req.method !== "POST"}}))

const requestLogger = (request, response, next) => {
    console.log("Method: ",request.method)
    console.log("Path: ", request.path)
    console.log("Body: ", request.body)
    console.log("---")
    next()
}

//app.use(requestLogger) //Basic solution without Morgan



let people = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request,response) => {
    response.json(people)
})


const generateId = () => {
  const maxId = people.length > 0
    ? Math.floor(Math.random()*10000000)
    : 1
    console.log(maxId)
  return maxId
}

app.post('/api/persons', (request, response) => {
  const body = request.body 
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number missing' 
    })
  }else{
    const sameNamePeople = people.filter(person => person.name === body.name) 
    if(sameNamePeople.length > 0){
    return response.status(400).json({ 
      error: 'Name already registered' 
    })
    }else{
      const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
      }
      people = people.concat(person)
      response.json(person)
    }
  }


})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body 
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or Number missing' 
    })
  }
  const id = Number(request.params.id) 
  console.log("ID is: ",id)
  const person = people.filter(person => person.id === id) 
  if(!person){
    return response.status(400).json({ 
      error: 'Person ID not found' 
    })
  }else if (person.length > 1){
    return response.status(400).json({ 
      error: 'Person ID appears more than once'
    })
  }
  console.log("Person: ",person)
  let updatedPerson = {...person[0], 
    number: body.number
  }
  console.log("Updated Person: ",updatedPerson)
  people = people.filter(person => person.id !== id).concat(updatedPerson) 
  response.json(updatedPerson)
})

app.get("/api/persons/:id", (request,response) => {
    const id = Number(request.params.id) 
    const personData = people.find(person => person.id === id)
    if (personData) {
        response.json(personData)
    }else{
        response.statusMessage("Person ID not found")
        response.status(400).end()
    }
})

app.get("/info", (request,response) => {
    const dateMessage = new Date()
    const peopleCount = people.length
    const message = `<p>Phonebook has info for ${peopleCount} people</p><p>${dateMessage}`
    
    response.send(message)
})

app.delete("/api/persons/:id", (request,response) => {
    const id = Number(request.params.id) 
    people = people.filter(person => person.id !== id)
    if (people) {  
        response.status(204).end()
    }else{
        response.statusMessage("Person ID not found")
        response.status(400).end()
    } 
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({error:"Unknown endpoint"})
}
app.use(unknownEndpoint)


const PORT = process.env.port || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})