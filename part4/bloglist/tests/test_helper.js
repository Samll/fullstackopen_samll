const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Titulo 1",
    author: "Author 1",
    url: "https://Author1.Titulo1.lib",
    likes: 10,
    id:1
  },
  {
    title: "Titulo 2",
    author: "Author 2",
    url: "https://Author2.Titulo2.lib",
    likes: 7,
    id:2
  },
  {
    title: "Titulo 3",
    author: "Author 1",
    url: "https://Author1.Titulo3.lib",
    likes: 12,
    id:3
  }
] 

const initialUsers = [
  {
    username: "Paco",
    name: "Paquito",
    notes: [ ],
    id: "6748c43fe22ba9a5496ae2f3"
    }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb
}