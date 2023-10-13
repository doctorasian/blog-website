const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Luffy D. Monkey: Dead or Alive',
    author: 'test author',
    url: 'example.com',
    likes: 25,
  },
  {
    title: 'test blog two',
    author: 'test author two',
    url: 'example.com',
    likes: 32,
  }
]

const nonExistingId = async () => {
  //Warning: required Blog params: (title)
  const blog = new Blog({ title: 'temporary blog' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}