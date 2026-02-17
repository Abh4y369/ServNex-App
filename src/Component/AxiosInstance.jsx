import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/'

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,  // Increased to 10 seconds
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    }
})

// Add response interceptor to see what's happening
AxiosInstance.interceptors.response.use(
    response => {
        console.log('✅ Response received:', response);
        return response;
    },
    error => {
        console.log('❌ Error details:', error);
        console.log('❌ Error response:', error.response);
        return Promise.reject(error);
    }
);

export default AxiosInstance