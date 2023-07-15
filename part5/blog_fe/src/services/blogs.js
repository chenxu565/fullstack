import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
  console.log('token', token)
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  console.log('newObject', newObject)
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  console.log('response', response)
  return response.data
}

const update = async (id, newObject) => {
  // console.log('newObject', newObject)
  const response = await axios.put(`${ baseUrl }/${id}`, newObject)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${ baseUrl }/${id}`, config)
  return response.data
}

export default { setToken, getAll, create, update, remove }