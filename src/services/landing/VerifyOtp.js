import { usePublicApi } from "../../api/axiosInstance"

export const verifyOtp = async (otpSubmit) => {
    const { code, message, status, data } = await usePublicApi.post("verifyOtp", otpSubmit);
    return { code, message, status, data };
}