import { redirect } from "react-router";
import { checkLoggedIn } from "../landing/checkLoggedinService";

/**
 * Guest-only route guard:
 * If user is already logged in, redirect them immediately to their dashboard
 * instead of letting them see /login or /signup.
 */
export const redirectIfLoggedIn = async () => {
    try {
        const res = await checkLoggedIn();
        if (res && res.code === 0 && res.data?.authenticated) {
            const role = res.data?.role ? res.data.role.toLowerCase() : "user";
            return redirect(`/${role}/dashboard`);
        }
    } catch (error) {
        console.error("Auth check error in redirectIfLoggedIn:", error);
    }
    return null;
};

/**
 * Protected user route guard:
 * Verifies session before entering /user routes and normalizes /user to /user/dashboard.
 */
export const dashboardRedirect = async ({ request }) => {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
        const res = await checkLoggedIn();
        if (!res || res.code !== 0 || !res.data?.authenticated) {
            return redirect("/login");
        }

        if (path === "/user" || path === "/user/") {
            return redirect("/user/dashboard");
        }
    } catch (error) {
        console.error("Auth check error in dashboardRedirect:", error);
        return redirect("/login");
    }

    return null;
};
