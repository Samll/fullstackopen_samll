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

module.exports = blogsRouter