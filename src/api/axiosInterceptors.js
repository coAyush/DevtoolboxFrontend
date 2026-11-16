import { usePublicApi, usePrivateApi, refreshApi } from "./axiosInstance";
import { toastError } from "../util/toat";

const handleResponse = async (response) => {
    // If the response is a binary Blob (e.g., downloaded PDF)
    if (response.data instanceof Blob || response.config?.responseType === 'blob') {
        // If the server returned an error JSON inside a blob response
        if (response.data?.type === 'application/json') {
            try {
                const text = await response.data.text();
                const parsed = JSON.parse(text);
                if (parsed.code === 8) {
                    toastError(parsed.message ?? "Something went wrong");
                    return Promise.reject(new Error(parsed.message));
                }
                return {
                    code: parsed.code,
                    message: parsed.message,
                    status: parsed.status,
                    data: parsed.data?.details ?? null
                };
            } catch {
                return response.data;
            }
        }
        return response.data;
    }

    if (response.data?.code === 8) {
        toastError(response.data.message ?? "Something went wrong");
        return Promise.reject(new Error(response.data.message));
    }
    console.log("response", response);
    const code = response.data?.code;
    const message = response.data?.message;
    const status = response.data?.status;
    const data = response.data?.data?.details ?? null;
    console.log(code, message, status, data);

    return { code, message, status, data };
};
let refreshPromise = null;

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = refreshApi
            .post("/refresh/access-token")
            .finally(() => { refreshPromise = null; }); // reset for next time
    }
    return refreshPromise;
};

const handlePrivateError = async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;        // ?. so network errors don't crash

    // not a 401, or we already retried once -> give up
    if (status !== 401 || !originalRequest || originalRequest._retry) {
        return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
        await refreshAccessToken();               // browser stores the new accessToken cookie
        return usePrivateApi(originalRequest);    // retry; goes through handleResponse again
    } catch (refreshError) {
        // refresh token is bad/expired -> session is over
        if (!window.location.pathname.startsWith("/login")) {
            window.location.href = "/login?reason=expired";
        }
        return Promise.reject(refreshError);
    }
};


const handlePublicError = (error) => {
    return Promise.reject(error);
};
// Automatically strip Content-Type for FormData so Axios / Browser sets multipart/form-data boundary
usePrivateApi.interceptors.request.use((config) => {
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    return config;
});

usePublicApi.interceptors.response.use(handleResponse, handlePublicError);
usePrivateApi.interceptors.response.use(handleResponse, handlePrivateError);