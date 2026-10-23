import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/'

const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

let refreshPromise = null

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
            return Promise.reject(error)
        }

        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) {
            return Promise.reject(error)
        }

        originalRequest._retry = true
        try {
            // Share a single refresh request when several API calls expire together.
            if (!refreshPromise) {
                refreshPromise = axios.post(
                    new URL('token/refresh/', baseURL).toString(),
                    { refresh }
                ).finally(() => {
                    refreshPromise = null
                })
            }
            const response = await refreshPromise
            localStorage.setItem('access_token', response.data.access)
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`
            return api(originalRequest)
        } catch (refreshError) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.assign('/')
            return Promise.reject(refreshError)
        }
    }
)

export default api
