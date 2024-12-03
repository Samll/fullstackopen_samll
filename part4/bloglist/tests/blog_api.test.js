const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog') 
const User = require('../models/user') 

describe('Working with existing Blogs', () => { 
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs) 
  })

  test('blog can be GET from api', async () => {
    const blogs = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/) 
    assert.strictEqual(blogs.body.length, helper.initialBlogs.length)
  })

  test('The unique identifier property of the blog posts is named id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api    
      .get(`/api/blogs/${blogToView.id}`)    
      .expect(200)    
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(resultBlog.body.id,blogToView.id)
  }) 

  test('Edition of a blog all values', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogID = blogsAtStart[0].id
    const newBlog = {
      title:"Edited under review",
      author:"Ministry of Information Transparency",
      url:"www.policeofinformation.info",
      likes:33
    }
    await api
      .put(`/api/blogs/${blogID}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const contentsTitles = blogsAtEnd.map(r => r.title)
    const contentsAuthor = blogsAtEnd.map(r => r.author)
    const contentsURL   = blogsAtEnd.map(r => r.url)
    const contentsLikes = blogsAtEnd.map(r => r.likes)
    assert(contentsTitles.includes(newBlog.title))
    assert(contentsAuthor.includes(newBlog.author))
    assert(contentsURL.includes(newBlog.url))
    assert(contentsLikes.includes(newBlog.likes))
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length)
  })

  test('Edition of a blog only likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogID = blogsAtStart[0].id
    const newBlog = {
      likes:33
    }
    await api
      .put(`/api/blogs/${blogID}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb() 
    const contentsLikes = blogsAtEnd.map(r => r.likes) 
    assert(contentsLikes.includes(newBlog.likes))
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length)
  })

  test('Edition without likes field', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogAtStart = blogsAtStart[0]
    const blogID = blogAtStart.id
    const newBlog = {
      title:"Edited under review",
      author:"Ministry of Information Transparency",
      url:"www.policeofinformation.info"
    }
    await api
      .put(`/api/blogs/${blogID}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    const contentsTitles = blogsAtEnd.map(r => r.title)
    const contentsAuthor = blogsAtEnd.map(r => r.author)
    const contentsURL   = blogsAtEnd.map(r => r.url)
    const contentsLikes = blogsAtEnd.map(r => r.likes)
    assert(contentsTitles.includes(blogAtStart.title))
    assert(contentsAuthor.includes(blogAtStart.author))
    assert(contentsURL.includes(blogAtStart.url))
    assert(contentsLikes.includes(blogAtStart.likes))
    assert.strictEqual(blogsAtEnd.length,blogsAtStart.length)
  })

})

describe('Creating Blogs', () => { 
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs) 
  })
  test('A new post increments the posts and data is retrieved OK', async () => { 
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

  test('A new post without likes field, autosets to 0', async () => {  
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

  test('A new post contains user data in json', async () => {   
    await User.deleteMany({})
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: "testpassword",
    }; 

    const userResponse = await api
    .post('/api/users/')
    .send(newUser)
    .expect(201);

    const userID = userResponse.body.id; 
    const newPost = {
      title: "Create a blog post and check user is associated",
      author: "The code",
      url: "The url of the code",
      likes: 345,
      user: userID
    };  

    const newPostResponse = await api    
      .post(`/api/blogs/`)   
      .send(newPost) 
      .expect(201) 

    const newPostRead = await api
      .get(`/api/blogs/${newPostResponse.body.id}`)
      .expect(200)  

      const newUserResponse = await api
      .get(`/api/users/${userID}`) 
      .expect(200);
 
    // Validate content on Blog shows User Data
    const userInPost = newPostRead.body.user;
    assert.ok(userInPost, "User data should be present in the post");
    assert.strictEqual(userInPost.username, newUser.username, "User's username should match");
    assert.strictEqual(userInPost.name, newUser.name, "User's name should match");

    // Validate User Data now contains Post
    const postInUser = newUserResponse.body.blogs[0]; 
    assert.ok(postInUser, "Post data should be present in the user profile");
    assert.strictEqual(postInUser.title, newPostResponse.body.title, "Post's title should match");
    assert.strictEqual(postInUser.author, newPostResponse.body.author, "Post's author should match");
    assert.strictEqual(postInUser.url, newPostResponse.body.url, "Post's url should match");
    assert.strictEqual(postInUser.id, newPostResponse.body.id, "Post's id should match");
  }) 

})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs) 
  })

  test('Delete and existing element returns 204 and reduces amount of blogs', async () =>{
    const blogsStart = await helper.blogsInDb() 
    const blogID = blogsStart[0].id
  
    await api.
      delete(`/api/blogs/${blogID}`)
      .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
  
      const contents = blogsAtEnd.map(r => r.id)
      assert(!contents.includes(blogID))
  
      assert.strictEqual(blogsAtEnd.length, blogsStart.length - 1)
    })
 

})

after(async () => {
  await mongoose.connection.close()
})