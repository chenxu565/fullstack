import {useState} from 'react'

const Blog = ({blog, handleUpdate}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const likeBlog = async() => {
    console.log('like')
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    handleUpdate(updatedBlog)
  }  

  return (
  <div style={blogStyle}>
    <div>
      {blog.title} {blog.author} 
      <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
    </div>
    {visible &&
      <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button onClick={likeBlog}>like</button>
        </div>
        <div>{blog.user.name}</div>
      </div>
    }
  </div>
  )
}

export default Blog