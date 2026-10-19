import { usePublicApi } from "../../api/axiosInstance"

export const getTools = async () => {
    const { code, message, status, data } = await usePublicApi.get("/tools/list");
    return { code, message, status, data };
}   