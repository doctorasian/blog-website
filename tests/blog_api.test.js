const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Luffy D. Monkey: Dead or Alive',
    author: 'test author',
    url: 'example.com',
    likes: 25,
  },
  {
    _id: '8a422aa71b54a676234d17f2',
    title: 'test blog two',
    author: 'test author two',
    url: 'example.com',
    likes: 32,
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)
  expect(titles).toContain(
    'Luffy D. Monkey: Dead or Alive'
  )
})

test('a valid blog can be added', async () => {
  const newBlog = {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Newly Added Blog',
    author: 'test author',
    url: 'example.com',
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(result => result.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'Newly Added Blog'
  )
}, 100000)

afterAll(async () => {
  await mongoose.connection.close()
})