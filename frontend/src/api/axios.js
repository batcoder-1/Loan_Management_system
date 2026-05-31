import axios from 'axios'

const API = axios.create({
    baseURL: 'https://loan-management-system-9z01.onrender.com/'
})

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token')
    if (token) {
        req.headers.authorization = `Bearer ${token}`
    }
    return req
})

export default API