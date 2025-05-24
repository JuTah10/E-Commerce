import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true // send cookies to the server //
})

export default axiosInstance;