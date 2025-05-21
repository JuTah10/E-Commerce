import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://react-ecommerce-clothing-store-backend.onrender.com/api",
    withCredentials: true // send cookies to the server //
})

export default axiosInstance;