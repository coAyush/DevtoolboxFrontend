import { usePublicApi } from "../../api/axiosInstance"

export const sendMailEnquiry = async ({ enquiry }) => {
    const { code, message, status, data } = await usePublicApi.post("/submit/enquiry", enquiry)
    return { code, message, status, data }
}