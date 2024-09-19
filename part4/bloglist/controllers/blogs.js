const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async(request, response) => { 
  const blogs = await Blog.find({});
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => { 
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  } 
})

blogsRouter.post('/', async(request, response, next) => {
  
  if((!request.body.title)||(!request.body.url)){
    response.status(400).end()
  }if(!request.body.likes){
    request.body.likes = 0;
  }
  const blog = new Blog(request.body)
  const postedBlog = await blog.save() 
  response.status(201).json(postedBlog) 
})

blogsRouter.delete('/:id', async (request, response) => { 
  await Blog.findByIdAndDelete(request.params.id) 
  response.status(204).end()
})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body
  if(!body.likes){
    response.status(400).end()
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