const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const User = require('../models/user')
const middleware = require('../utils/middleware')
// const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1 , name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).orFail(new Error('BlogNotFound'))
  response.json(blog)
})

blogsRouter.post('/', middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
      return response.status(400).end()
    }

    const user = request.user

    const blog = new Blog({
      url: body.url,
      title: body.title,
      author: body.author,
      user: user._id,
      likes: body.likes || 0
    })

    const savedBlog = await blog.save()
    const populatedBlog = await Blog.populate(savedBlog, { path: 'user', select: { username: 1 , name: 1, id: 1 } })

    user.blogs = user.blogs.concat(populatedBlog._id)
    await user.save()

    response.status(201).json(populatedBlog)
  })

blogsRouter.delete('/:id', middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response) => {
    const foundBlog = await Blog.findById(request.params.id).orFail(new Error('BlogNotFound'))

    const user = request.user
    // console.log(user)
    if (foundBlog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'user not authorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id).orFail(new Error('BlogNotFound'))

    user.blogs = user.blogs.pull(request.params.id)
    await user.save()

    // const updatedUser = await User.findById(user.id)
    // console.log(updatedUser)

    response.status(204).end()
  })

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' })
    .orFail(new Error('BlogNotFound'))
  // console.log(updatedBlog)
  const populatedBlog = await Blog.populate(updatedBlog, { path: 'user', select: { username: 1 , name: 1, id: 1 } })
  response.json(populatedBlog)
})

module.exports = blogsRouter