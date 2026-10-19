import toast from "react-hot-toast"

export const toastSuccess = (message) => {
    toast.dismiss()
    return toast.success(message)
}
export const toastError = (message) => {
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