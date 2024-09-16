const notesRouter = require('express').Router()
const Note = require('../models/note')
const { nonExistingId } = require('../tests/test_helper')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes) 
}) 

notesRouter.get('/:id', async (request, response, next) => {
  try{
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }catch(exception){ 
    next(exception)
  } 
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })
  try{
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  }catch(exception){
    next(exception)
  }
})

notesRouter.delete('/:id', async(request, response, next) => {
  
  try{
    await Note.findByIdAndDelete(request.params.id);
    response.status(204).end()
  }catch(exception){
    next(exception)
  } 
})

notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body 
  const note = {
    content: body.content,
    important: body.important,
  }
  try{
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id, 
       note, 
       { new: true, runValidators: true, context: 'query' }
      )
    response.json(updatedNote)
    }catch(exception){
      next(exception)
    }  
})

module.exports = notesRouter