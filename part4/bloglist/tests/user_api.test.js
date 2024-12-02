const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user') 

describe('Create a New User', () => { 
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers) 
  })

  test('user can be created if all attributes are provided', async () => {
    const user = {
      username: "Paca",
      name: "Paquita",
      password: "Pacota"
    }
  
    const createdUser = await api
      .post('/api/users') 
      .send(user) 
      .expect(201)
      .expect('Content-Type', /application\/json/) 
      const usersAtEnd = await helper.usersInDb()
      const usernames = usersAtEnd.map(r => r.username)
      const names = usersAtEnd.map(r => r.name) 
      assert(usernames.includes(user.username))
      assert(names.includes(user.name))
  })

  test('user cannot be created with missing username', async () => {
    const user = {
      name: "Paquita2",
      password: "Pacota2"
    }
    const usersAtStart = await helper.usersInDb()
    const responseUserCreation = await api
      .post('/api/users')
      .send(user) 
      .expect(400)
      .expect('Content-Type', /application\/json/ )

    assert(responseUserCreation.body.error === 'missing data for username and/or password')
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(r => r.username)
    const names = usersAtEnd.map(r => r.name) 
    assert(usernames.includes(usersAtStart[0].username))
    assert(names.includes(usersAtStart[0].name))
    assert.strictEqual(usersAtStart.length,usersAtEnd.length)
  })

  test('user cannot be created with short username', async () => {
    const userShort = {
      username: "Pa",
      name: "Paquita2",
      password: "Pacota2"
    }
    const usersAtStart = await helper.usersInDb()
    const responseUserCreation = await api
      .post('/api/users')
      .send(userShort) 
      .expect(400)
      .expect('Content-Type', /application\/json/ )

    assert(responseUserCreation.body.error === 'password or username must be at least 3 characters long')
    const usersAtEnd = await helper.usersInDb()
    const usernames = usersAtEnd.map(r => r.username)
    const names = usersAtEnd.map(r => r.name) 
    assert(usernames.includes(usersAtStart[0].username))
    assert(names.includes(usersAtStart[0].name))
    assert.strictEqual(usersAtStart.length,usersAtEnd.length)
  })

  test('user cannot be created with missing password', async () => {
    const user = {
      name: "Paquita3",
      username: "Pacota3"
    }
    const usersAtStart = await helper.usersInDb()
    const responseUserCreation = await api
      .post('/api/users')
      .send(user) 
      .expect(400)
      .expect('Content-Type', /application\/json/) 

      assert(responseUserCreation.body.error === 'missing data for username and/or password')
      const usersAtEnd = await helper.usersInDb()
      const usernames = usersAtEnd.map(r => r.username)
      const names = usersAtEnd.map(r => r.name) 
      assert(usernames.includes(usersAtStart[0].username))
      assert(names.includes(usersAtStart[0].name))
      assert.strictEqual(usersAtStart.length,usersAtEnd.length)
  })
})

after(async () => {
  await mongoose.connection.close();
});