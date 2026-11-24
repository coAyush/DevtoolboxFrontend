import { usePrivateApi } from "../../api/axiosInstance";

export const checkLoggedIn = async () => {
    try {
        const res = await usePrivateApi.post("/users/me", {}, { skipAuthRedirect: true });
        return res;
    } catch (error) {
        return null;
    }
};