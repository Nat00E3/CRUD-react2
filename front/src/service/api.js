import axios from 'axios'

const api = axios.create({
  baseURL: 'http://10.145.57.233:8800'
})

export default api