import { usePublicApi, usePrivateApi, refreshApi } from "./axiosInstance";
import { toastError } from "../util/toat";

const handleResponse = (response) => {
    if (response.data?.code === 8) {
        toastError(response.data.message ?? "Something went wrong");
        return Promise.reject(new Error(response.data.message));
    }
    console.log("response", response);
    const code = response.data.code
    const message = response.data.message;
    const status = response.data.status;
    const data = response.data.data?.details ?? null
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
usePublicApi.interceptors.response.use(handleResponse, handlePublicError);
usePrivateApi.interceptors.response.use(handleResponse, handlePrivateError);