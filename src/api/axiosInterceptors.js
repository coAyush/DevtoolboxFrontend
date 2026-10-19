import { usePublicApi, usePrivateApi } from "./axiosInstance";
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

const handleError = (error) => {
    if (
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT"
    ) {
        toastError("Request timed out. Please try again.");
    } else if (error.response?.status === 401) {
        toastError(error.response.data?.message ?? "Unauthorized");
    } else if (error.response?.status === 404) {
        toastError("Resource not found.");
    } else if (error.response?.status >= 500) {
        toastError("Server error. Please try again later.");
    } else if (error.request && !error.response) {
        toastError("Unable to reach the server.");
    }

    return Promise.reject(error);
};

[usePublicApi, usePrivateApi].forEach((api) => {
    api.interceptors.response.use(handleResponse, handleError);
});