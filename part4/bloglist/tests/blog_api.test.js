const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog') 

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})


test('blog can be GET from api', async () => {
  const blogs = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/) 
  assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api    
    .get(`/api/blogs/${blogToView.id}`)    
    .expect(200)    
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resultBlog.body.id,blogToView.id)
}) 

test('a new post increments the posts and data is retrieved OK', async () => { 
  const blogs = await helper.blogsInDb() 
  const originalLength = blogs.length
  const newPost = {
    title: "Create a blog post",
    author: "The code",
    url: "The url of the code",
    likes: 0   
  };  

  const newPostResponse = await api    
    .post(`/api/blogs/`)   
    .send(newPost) 
    .expect(201)
 
  const blogsUpdated = await helper.blogsInDb()
  assert.strictEqual(blogsUpdated.length,originalLength+1) 

  const newPostRead = await api
    .get(`/api/blogs/${newPostResponse.body.id}`)
    .expect(200) 
    assert.strictEqual(newPostRead.body.title,newPost.title)
    assert.strictEqual(newPostRead.body.author,newPost.author)
    assert.strictEqual(newPostRead.body.url,newPost.url)
    assert.strictEqual(newPostRead.body.likes,newPost.likes) 
}) 

test('a new post without likes field, autosets to 0', async () => {  
  const newPost = {
    title: "Create a blog post without likes",
    author: "The code",
    url: "The url of the code"
  };  

  const newPostResponse = await api    
    .post(`/api/blogs/`)   
    .send(newPost) 
    .expect(201) 

  const newPostRead = await api
    .get(`/api/blogs/${newPostResponse.body.id}`)
    .expect(200)  
    assert.strictEqual(newPostRead.body.likes,0) 
}) 

after(async () => {
  await mongoose.connection.close()
})