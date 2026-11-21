import { usePrivateApi } from "../../api/axiosInstance";

/**
 * Service to fetch user subscription pricing plans.
 * Backend Endpoint: GET /api/users/plans
 * Returns list of PriceResponseDto (amount, tier, role, duration, isActive)
 */
export const getUserPlansApi = async () => {
    try {
        const response = await usePrivateApi.get("/users/plans");
        return response;
    } catch (error) {
        console.error("Failed to fetch user pricing plans:", error);
        throw error;
    }
};

/**
 * Service to fetch user profile details including subscription and usage stats.
 * Backend Endpoint: GET /api/users/profile-details
 * Returns UserProfileResponseDto
 */
export const getUserProfileApi = async () => {
    try {
        const response = await usePrivateApi.get("/users/profile-details");
        return response;
    } catch (error) {
        console.error("Failed to fetch user profile details:", error);
        throw error;
    }
};
