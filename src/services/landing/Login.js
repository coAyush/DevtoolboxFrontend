import { usePublicApi } from "../../api/axiosInstance"

export const loginService = async ({ loginForm }) => {
    const { code, message, status, data } = await usePublicApi.post("/login", loginForm)
    return { code, message, status, data }
}