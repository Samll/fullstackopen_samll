const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate("blogs",{ url: 1, title: 1, author: 1, id: 1 })
  console.log(users)
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => { 
  const user = await User.findById(request.params.id).populate("blogs",{ url: 1, title: 1, author: 1, id: 1 })
  if (user) {
    response.json(user)
  } else {
    response.status(404).end()
  } 
})

usersRouter.post('/', async(request, response, next) => { 
  const {username, password, name} = request.body
  if((!username)||(!password)){
    return response.status(400).json({ error: 'missing data for username and/or password' }).end()
  }
  if((password.length < 3) || (username.length < 3)){
    return response.status(400).json({ error: 'password or username must be at least 3 characters long' }).end() 
  }
  const usernameDB = await User.findOne({ username })
  if(usernameDB){
    return response.status(400).json({ error: 'user already exists' }).end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash,
  }) 
  const savedUser = await user.save()
  response.status(201).json(savedUser) 
})

usersRouter.delete('/:id', async (request, response) => { 
  await User.findByIdAndDelete(request.params.id) 
  response.status(204).end()
})

usersRouter.put('/:id', async (request,response) => {
  const body = request.body
  if(!body.likes){
    response.status(400).end()
  }
  const oldUser = await User.findById(request.params.id)
  const user = {
    title:(body.title?body.title:oldUser.title),
    author:(body.author?body.author:oldUser.author),
    url:(body.url?body.url:oldUser.url),
    likes:body.likes
  }
  const updatedUser = await User.findByIdAndUpdate(
    request.params.id,
    user,
    {new: true}  
  )
  response.json(updatedUser)
})

module.exports = usersRouter