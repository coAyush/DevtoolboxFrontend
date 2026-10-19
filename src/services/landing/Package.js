import { usePublicApi } from "../../api/axiosInstance";
import { toastError } from "../../util/toat";

export const DEFAULT_PACKAGES = [
    {
        tier: "Free",
        role: "user",
        price: "$0",
        features: [
            "100 Web tool uses/day",
            "Basic developer utilities",
            "Community Discord support",
            "Standard export formats"
        ]
    },
    {
        tier: "Normal Pro",
        role: "user",
        price: "$4.99",
        features: [
            "Unlimited web tools",
            "Priority processing queue",
            "Ad-free workspace",
            "Standard email support"
        ]
    },
    {
        tier: "Developer",
        role: "developer",
        price: "$9.99",
        features: [
            "10,000 API requests/month",
            "Sub-millisecond latency SLA",
            "Redis rate-limit metrics",
            "Developer portal & API keys"
        ]
    },
    {
        tier: "Enterprise Pro",
        role: "developer",
        price: "$19.99",
        features: [
            "50,000 API requests/month",
            "Dedicated Redis bucket",
            "Advanced telemetry & webhooks",
            "24/7 Priority engineering support"
        ]
    }
];

/**
 * Fetches pricing packages from backend.
 * @returns {Promise<{packages: Array, isFallback?: boolean}>}
 */
export const getPackages = async () => {
    try {
        // Axios interceptor automatically unwraps `response.data`
        const { code, message, status, data } = await usePublicApi.get("/prices");
        // Normalize response whether backend returns { packages: [...] } or { data: { packages: [...] } }
        return { code, message, status, data };
    } catch (error) {
        console.warn("[PackageService] Backend unreachable or failed, serving fallback packages:", error.message);
        console.log(error);

        if (error.response?.status == 401) {
            toastError("unauthorized !! Please login first to continue");
        }
        throw error;
    }
};