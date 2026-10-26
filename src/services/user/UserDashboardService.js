import { usePrivateApi } from "../../api/axiosInstance";

export const getDashboardDetails = async ({ request }) => {
    const { code, message, status, data } = await usePrivateApi.get("/users/dashboard");
    return { code, message, status, data };
}