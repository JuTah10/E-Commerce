import axios from "axios"

console.log( import.meta.env.VITE_BACKEND_URL)

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true // send cookies to the server //
})

export default axiosInstance;