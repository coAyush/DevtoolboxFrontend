import { redirect, useLocation } from "react-router"
import { usePrivateApi } from "../../api/axiosInstance"

export const dashboardRedirect = ({ request }) => {
    console.log("in dashboard redirect");

    try {
        console.log(request);
        const url = new URL(request.url);
        console.log(url);

        const path = url.pathname;
        console.log(path);

        if (path === "/user") {
            return redirect("/user/dashboard");
        }
    } catch (error) {
        console.log(error);
    }

    return null;


}   