import { usePublicApi } from "../../api/axiosInstance"
import { toastError, toastSuccess } from "../../util/toat";

export const SignupUser = async ({ form }) => {
    const { code, message, status, data } = await usePublicApi.post(`/signup`, form);
    return { code, message, status, data };
}