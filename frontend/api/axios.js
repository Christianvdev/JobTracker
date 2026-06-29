import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('Response error:', error.response.status)

        if (error.response.status === 401) {
            try {
                const refresh = localStorage.getItem('refresh_token')
                console.log('Refresh token exists:', !!refresh)

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/token/refresh/`,
                    { refresh }
                )

                console.log('New token received:', response.data.access)

                localStorage.setItem('access_token', response.data.access)
                error.config.headers.Authorization = `Bearer ${response.data.access}`
                return api(error.config)

            } catch(err) {
                console.log('Refresh failed:', err)
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                window.location.href = '/'
            }
        }

        return Promise.reject(error)
    }
)

export default api