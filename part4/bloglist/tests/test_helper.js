const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

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
    password: "PassPaquito",
    notes: [ ]
    },
    {
      username: "Tote",
      name: "Totete",
      password: "PassTote",
      notes: [ ]
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

const createUserWithPasswordHash = async () => {
  for (const userData of initialUsers) {
    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = new User({
      username: userData.username,
      name: userData.name,
      notes: userData.notes,
      passwordHash: passwordHash
    });
    await user.save();
  }
};

const createInitialBlogsLinkedToUser = async (user) => {
  const associatedBlogs = initialBlogs.map(blog => blog.user = user.id)
  return associatedBlogs
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb, createUserWithPasswordHash, createInitialBlogsLinkedToUser
}