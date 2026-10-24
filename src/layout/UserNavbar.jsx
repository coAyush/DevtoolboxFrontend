import { Boxes, Loader2 } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router'
import { useUserDetails } from '../context/User/UserDetailsContext'

const UserNavbar = () => {
    const { user, loading } = useUserDetails();
    console.log("in navbar");
    if (loading)
        return <Loader2 />
    console.log(user);
    const details = user.userDetails;
    console.log("details");

    console.log(details);


    const Links = {
        "Dashboard": "/user/dashboard",
        "Tool Suite": "/user/tools",
        "Pricing": "/user/pricing",
        "Profile": "/user/profile"
    }
    const link = details.imageUrl ? details.imageUrl : null;
    const status = details.isActive ? details.isActive : false;
    return (
        <>
            <div className="flex flex-col justify-between h-screen w-[20%] bg-gradient-to-b from-[#0B1220] via-[#080F1C] to-[#050914] border-r border-white/10 z-50 sticky left-0">
                <div className='flex gap-1 items-center md:ml-2 md:w-fit w-full'>
                    <NavLink to={"/user/dashboard"}>
                        {/* logo  */}
                        <div aria-label='logo' className='w-12 h-12 rounded-xl
bg-gradient-to-br from-cyan-400/20 to-indigo-500/20
border border-cyan-400/30
flex items-center justify-center text-cyan-300
hover:border-cyan-300/70 hover:shadow-lg hover:shadow-cyan-500/10
transition-all duration-300 p-2 mt-3 ml-2'>
                            <Boxes className='transition-transform group-hover:scale-110' size={30} />
                        </div>
                    </NavLink>
                    <h1 className='text-white text-2xl tracking-normal font-medium'>DevToolBox</h1>
                </div>
                <nav className="flex flex-col gap-2 p-2">
                    {Object.entries(Links).map(([key, value]) => {
                        console.log([key, value]);

                        return <NavLink
                            key={key}
                            to={value}
                            end={key === "Dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3 py-2 transition-colors duration-200
                ${isActive
                                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                                {/* Replace with the appropriate icon */}
                                <span className="text-sm font-medium">
                                    {key === "Dashboard" ? "DB" :
                                        key === "Tool Suite" ? "TS" : key === "Pricing" ? "PR" : "P"}
                                </span>
                            </div>

                            <span className="text-sm font-medium">
                                {key}
                            </span>
                        </NavLink>
                    })}
                </nav>
                <div
                    aria-label="card-info"
                    className="mb-7 flex items-center gap-3 w-[calc(100%-20px)]
    min-h-28 rounded-2xl border border-cyan-500/30
    shadow-[0_0_15px_rgba(6,182,212,0.15)]
    p-3 mt-3 ml-2
    bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-violet-500/20"
                >
                    {/* Profile photo */}
                    <div
                        aria-label="profile photo"
                        className="shrink-0 h-12 w-12 rounded-full overflow-hidden
        flex items-center justify-center"
                    >
                        {link ? (
                            <img
                                src={details.imageUrl}
                                alt="user"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full rounded-full bg-green-900
            flex items-center justify-center text-2xl font-bold text-white">
                                {details.name ? details.name.charAt(0).toUpperCase() : "U"}
                            </div>
                        )}
                    </div>

                    {/* User details */}
                    <div className="flex min-w-0 flex-col justify-center gap-1">
                        <h1 className="text-base font-bold text-white tracking-normal">
                            {details.name ?? "Anonymous"}
                        </h1>

                        <div aria-label="status" className="flex items-center gap-2">
                            <div
                                className={`${status ? "bg-green-500" : "bg-red-500"}
                h-2 w-2 shrink-0 rounded-full`}
                            />
                            <span
                                className={`${status ? "text-green-500" : "text-red-500"}
                text-sm font-medium`}
                            >
                                {status ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserNavbar