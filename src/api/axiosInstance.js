import axios from "axios";

export const usePublicApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: false,
    timeout: 10000,
    timeoutErrorMessage: 'Request timeout',
})

export const usePrivateApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout: 10000,
    timeoutErrorMessage: 'Request timeout',
})