import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoggedUser from './components/LoggedUser'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('green')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    if (user) {
      console.log('user', user)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    } else {
      setBlogs([])
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log('loggedUserJSON', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log('user', user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setMessage('Logged out')
    setMessageType('green')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleBlogUpdate = async (updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(updatedBlog.id, updatedBlog)
      console.log('returnedBlog', returnedBlog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : returnedBlog))
    } catch (error) {
      console.error(error)
    }
  }

  const handleBlogRemoval = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (!result) {
      return
    }
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddBlog = async (blogObject) => {
    try {
      noteFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      console.log('returnedBlog', returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setMessageType('green')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.error(error)
    }
  }

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      { !user &&
        <div>
          <h2> log in to application</h2>
          <Notification message={message} messageType={messageType}/>
          <LoginForm setUser={setUser} setMessage={setMessage} setMessageType={setMessageType} />        </div>
      }
      { user &&
        <div>
          <h2>blogs</h2>
          <Notification message={message} messageType={messageType} />
          <LoggedUser user={user} handleLogout={handleLogout} />
          <Togglable buttonLabel="new blog" ref={noteFormRef}>
            <h2>create new</h2>
            <BlogForm handleAddBlog={handleAddBlog} />
          </Togglable>
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog}
              handleBlogUpdate={handleBlogUpdate}
              handleBlogRemoval={handleBlogRemoval}/>
          )}
        </div>
      }
    </div>
  )
}

export default App