const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async(request, response) => { 
  const blogs = await Blog.find({}).populate("user", {username:1, name:1, id:1});
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => { 
  const blog = await Blog.findById(request.params.id).populate("user", {username:1, name:1, id:1});
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  } 
})

blogsRouter.post('/', async(request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  
  if((!request.body.title)||(!request.body.url)){
    response.status(400).end()
  }if(!request.body.likes){
    request.body.likes = 0;
  }
  request.body.user = user.id;
    
  const blog = new Blog(request.body)
  const postedBlog = await blog.save() 
  user.blogs = user.blogs.concat(postedBlog._id)
  await user.save()

  response.status(201).json(postedBlog) 
})

blogsRouter.delete('/:id', async (request, response) => { 
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blogToDelete = await Blog.findById(request.params.id)
  if (decodedToken.id != blogToDelete.user.toString()){
    return response.status(401).json({ error: 'Current user unauthorized to delete selected post '})
  }
  await Blog.findByIdAndDelete(request.params.id) 
  response.status(204).end()
})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body
  if(!body.likes){
    response.status(400).json({ error: 'Cannot edit without likes field' }).end()
  }
  const oldBlog = await Blog.findById(request.params.id)
  const blog = {
    title:(body.title?body.title:oldBlog.title),
    author:(body.author?body.author:oldBlog.author),
    url:(body.url?body.url:oldBlog.url),
    likes:body.likes
  }
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {new: true}  
  )
  response.json(updatedBlog)
})

module.exports = blogsRouter