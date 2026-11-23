import { usePrivateApi } from "../../api/axiosInstance";

export const createPayment = async (id) => {
    return await usePrivateApi.post("/users/payment-create", null, {
        params: {
            packageId: id
        }
    });
};

export const veryifyPayments = async (payload) => {
    return await usePrivateApi.post("/users/payment/verify", {
        razorpay_order_id: payload.razorpay_order_id,
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature
    });
};

export const failedPaymentRequest = async (payload) => {
    return await usePrivateApi.post("/users/payment/failed", {
        razorpay_order_id: payload.razorpay_order_id,
        reason: payload.reason
    });
};
