import React from "react";

const PricingComponent = ({ data }) => {
    return (
        <div
            className="
                h-auto min-h-[350px] w-full max-w-sm
                rounded-2xl p-[1px]
                bg-gradient-to-b from-pink-500 via-purple-500 to-cyan-500
                shadow-[0_0_25px_rgba(139,92,246,0.15)]
                hover:scale-105
                hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                transition-all duration-500 ease-in-out
            "
        >
            <div
                className="
                    h-full w-full rounded-2xl
                    bg-slate-950/95 backdrop-blur-xl p-6
                    flex flex-col gap-5
                "
            >
                <div className="w-full text-center">
                    <h2
                        className="
                            font-bold text-2xl text-transparent
                            bg-clip-text bg-gradient-to-r
                            from-cyan-400 via-purple-400 to-pink-400
                            uppercase
                        "
                    >
                        {data.tier}
                    </h2>
                </div>

                <div className="text-center">
                    <span className="text-4xl font-bold text-white">
                        ₹{data.amount}
                    </span>

                    <p className="mt-2 text-sm text-slate-400">
                        per {data.duration} days
                    </p>
                </div>

                <div>
                    <ul className="flex flex-col gap-3">
                        <li className="text-base text-slate-300 flex items-center gap-2">
                            <span className="text-cyan-400">✓</span>
                            {data.tier === "FREE"
                                ? "Free plan"
                                : "Premium plan"}
                        </li>

                        <li className="text-base text-slate-300 flex items-center gap-2">
                            <span className="text-cyan-400">✓</span>
                            {data.role === "USER"
                                ? "Normal user access"
                                : "Developer API access"}
                        </li>

                        <li className="text-base text-slate-300 flex items-center gap-2">
                            <span className="text-cyan-400">✓</span>
                            Valid for {data.duration} days
                        </li>
                    </ul>
                </div>

                <button
                    type="button"
                    className="
                        mt-auto w-full py-2.5 rounded-lg
                        bg-gradient-to-r from-cyan-500 to-purple-600
                        text-white font-medium
                        hover:from-cyan-400 hover:to-purple-500
                        transition-all
                    "
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default PricingComponent;