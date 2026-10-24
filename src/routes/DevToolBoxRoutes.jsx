import { createBrowserRouter, RouterProvider } from "react-router";

import AppLayout from "../layout/AppLayout";

import Landing from "../pages/landing/Landing";
import Features from "../pages/landing/feature/Features";
import Pricing from "../pages/landing/Pricing";

import Loading from "../pages/Loading";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import Tools from "../pages/landing/Tools";
import AboutUs from "../pages/landing/AboutUs";
import { getPackages } from "../services/landing/Package";
import { ServerError } from "../util/ServerError";
import NotFound from "../util/NotFound";
import { getTools } from "../services/landing/Tools";
import UserAppLayout from "../layout/UserAppLayout";
import UserTools from "../pages/user/UserTools";
import UserPricicng from "../pages/user/UserPricicng";
import { dashboardRedirect } from "../services/user/DahboardRedirect";
import UserDashboard from "../components/user/Dashboard";
import { getDashboardDetails } from "../services/user/UserDashboardService";

// eslint-disable-next-line react-refresh/only-export-components
export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        errorElement: <ServerError />,
        children: [
            {
                path: "/",
                element: <Landing />,
            },
            {
                path: "features",
                element: <Features />
            },
            {
                path: "pricing",
                element: <Pricing />,
                loader: getPackages
            }
            ,
            {
                path: "tools",
                element: <Tools />,
                loader: getTools
            },
            {
                path: "aboutUs",
                element: <AboutUs />
            }
        ]
    },
    {
        path: "/signup",
        element: <Signup />
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/password-reset",
        element: <ForgotPassword />
    },
    {
        path: "*",
        element: <NotFound />
    },
    {
        element: <UserAppLayout />,
        path: "/user",
        loader: dashboardRedirect,
        children: [
            {
                path: "dashboard",
                element: <UserDashboard />,
                loader: getDashboardDetails
            },
            {
                path: "tools",
                element: <UserTools />
            },
            {
                path: "pricing",
                element: <UserPricicng />
            }
        ]
    }
]
);

const DevToolBoxRoutes = () => {
    return (
        <RouterProvider
            router={router}
            fallbackElement={<Loading />}
        />
    );
};

export default DevToolBoxRoutes;