import toast from "react-hot-toast"
let limitShownAt = 0;
const LIMIT_WINDOW_MS = 4000;

export const toastLimit = (message) => {
    limitShownAt = Date.now();
    toast.dismiss()
    return toast.error(message, { id: "limit-exceeded", duration: LIMIT_WINDOW_MS })
}

export const toastSuccess = (message) => {
    toast.dismiss()
    return toast.success(message)
}
export const toastError = (message) => {
    if (Date.now() - limitShownAt < LIMIT_WINDOW_MS) return;
    toast.dismiss()
    return toast.error(message)
}
export const toastLoading = (message) => {
    toast.dismiss()
    return toast.loading(message)
}
export const toastCustom = (message) => {
    toast.dismiss()
    return toast(message, {
        style: {
            background: "#000",
            color: "#fff",
        },
    })
}