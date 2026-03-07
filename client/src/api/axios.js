import axios from 'axios'
import { errorToast } from '../utils/toast'

const API_URL = import.meta.env.VITE_API_URL
const baseURL = import.meta.env.DEV ? '/api' : API_URL ? `${API_URL}/api` : '/api'

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('atm_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.errors?.[0]?.message ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong'

    if (message) {
      errorToast(message)
    }

    return Promise.reject(error)
  }
)

