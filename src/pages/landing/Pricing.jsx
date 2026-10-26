import { useMemo, useState } from "react";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { useLoaderData } from "react-router";
import PricingComponent from "../../components/landing/PricingComponent";

const Pricing = () => {
    const { code, message, status, data } = useLoaderData();

    // Production best practice: Defensive data extraction using optional chaining
    const initialPackages = data || (Array.isArray(data) ? data : []);
    const [packageData] = useState(initialPackages);

    //const data=useLoaderData();
    // console.log(data);
    const [role, setRole] = useState("user");
    const handleRole = () => {
        setRole((prev) => (prev === "user" ? "developer" : "user"));
    };

    /*   useEffect(()=>{
           setPriceData(data.filter((item)=>item.role===role));
       },[role]);*/
    /* const [priceData,setPriceData]=useState(
        [
         {id : 0,
          role :"user",
          price :"0",
          limit: "100/day"   
         }
        ]
     )*/
    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center px-4 pt-4">

            {/* Heading */}
            <div className="text-center mb-3">
                <h1
                    className="
                        font-bold
                        text-4xl
                        sm:text-5xl
                        md:text-6xl
                        text-transparent
                        bg-clip-text
                        bg-gradient-to-r
                        from-cyan-400
                        via-purple-500
                        to-pink-500
                    "
                >
                    Predictable, Transparent Pricing
                </h1>

                <p className="mt-3 text-sm md:text-base text-slate-400">
                    Simple pricing for everyone. Powerful options for developers.
                </p>
            </div>


            {/* 
             * RESPONSIVE TOGGLE / TAB BAR TIP:
             * Don't lock the tab container to a rigid height like `h-12`.
             * Instead use `min-h-12 h-auto py-1` and responsive font sizes (`text-xs sm:text-sm`)
             * so labels on mobile phones don't wrap awkwardly or get cut off.
             */}
            <div
                className="
                    relative
                    w-full
                    max-w-md sm:max-w-lg
                    min-h-12 h-auto
                    rounded-xl
                    p-[1px]
                    bg-gradient-to-r
                    from-cyan-500
                    via-purple-500
                    to-pink-500
                    shadow-[0_0_25px_rgba(139,92,246,0.12)]
                "
            >
                <div
                    className="
                        relative
                        w-full
                        h-full
                        min-h-[46px]
                        rounded-xl
                        bg-slate-950/95
                        backdrop-blur-xl
                        flex
                        items-center
                        justify-between
                        px-2.5 sm:px-4
                        py-1
                        gap-1 sm:gap-2
                    "
                >

                    {/* Normal User */}
                    <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`
                            flex-1
                            text-xs sm:text-sm
                            font-medium
                            transition-all
                            duration-300
                            focus-visible:outline-none
                            ${role === "user"
                                ? "text-cyan-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }
                        `}
                    >
                        Normal User Plans
                    </button>
                    <button
                        type="button"
                        onClick={handleRole}
                        aria-label="Switch pricing plans"
                        className="
                            shrink-0
                            flex
                            items-center
                            justify-center
                            text-purple-400
                            hover:text-cyan-400
                            transition-all
                            duration-300
                            hover:scale-110
                            active:scale-95
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-purple-400/40
                            rounded-md
                            p-1
                        "
                    >
                        {role === "user" ? (
                            <FaToggleOff size={28} className="sm:w-8 sm:h-8" />
                        ) : (
                            <FaToggleOn size={28} className="sm:w-8 sm:h-8" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("developer")}
                        className={`
                            flex-1
                            text-xs sm:text-sm
                            font-medium
                            transition-all
                            duration-300
                            focus-visible:outline-none
                            ${role === "developer"
                                ? "text-purple-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }
                        `}
                    >
                        Developer API Plans
                    </button>

                </div>
            </div>
            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-slate-500">
                Showing{" "}
                <span
                    className={
                        role === "user"
                            ? "text-cyan-400 font-medium"
                            : "text-purple-400 font-medium"
                    }
                >
                    {role === "user" ? "Normal User" : "Developer API"}
                </span>{" "}
                plans
            </p>
            <div className="w-full max-w-6xl mt-6 sm:mt-10">
                {role === "user" ? (
                    <div className="text-center text-slate-500">
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                    </div>
                )}
            </div>
            {/* Responsive grid for pricing plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl justify-items-center mb-12">
                {packageData.filter((item) => item.role.toLowerCase() === role).map((plan) => (
                    <PricingComponent key={plan.tier} data={plan} />
                ))}
            </div>
        </div>
    );
};

export default Pricing;