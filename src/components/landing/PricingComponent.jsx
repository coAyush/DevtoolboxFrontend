import React from "react";
import { Link } from "react-router";
import { Check } from "lucide-react";

const PricingComponent = ({ data }) => {
    const isPro = data?.tier !== "FREE";

    return (
        <div
            className={`
                h-auto min-h-[360px] w-full max-w-sm
                rounded-2xl p-6
                bg-slate-900/60
                border
                ${isPro ? "border-cyan-500/50 shadow-xl shadow-cyan-950/20" : "border-slate-800"}
                hover:border-slate-700
                flex flex-col gap-6
                transition-all duration-200
                hover:-translate-y-1
                relative
            `}
        >
            {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 font-bold text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                    Recommended
                </div>
            )}

            {/* Tier Title */}
            <div className="w-full text-center space-y-1">
                <h2 className="font-bold text-lg text-white uppercase tracking-wider font-mono">
                    {data?.tier} PLAN
                </h2>
                <p className="text-xs text-slate-400">
                    {data?.tier === "FREE" ? "For personal everyday use" : "For power creators and teams"}
                </p>
            </div>

            {/* Price */}
            <div className="text-center py-2 border-y border-slate-800/80">
                <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        ₹{data?.amount}
                    </span>
                    <span className="text-xs text-slate-400">
                        / {data?.duration} days
                    </span>
                </div>
            </div>

            {/* Features */}
            <div className="flex-1">
                <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-cyan-400 shrink-0" />
                        <span>{data?.tier === "FREE" ? "Standard daily limits" : "High-capacity processing"}</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-cyan-400 shrink-0" />
                        <span>All Web Studio utilities included</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <Check size={16} className="text-cyan-400 shrink-0" />
                        <span>Valid for full {data?.duration} days</span>
                    </li>
                </ul>
            </div>

            {/* CTA */}
            <Link
                to="/signup"
                className={`
                    w-full py-2.5 rounded-xl
                    text-center text-xs sm:text-sm font-semibold
                    transition-colors duration-150
                    shadow-sm
                    ${
                        isPro
                            ? "bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                            : "bg-slate-800 hover:bg-slate-700 text-white"
                    }
                `}
            >
                {data?.tier === "FREE" ? "Get Started Free" : "Upgrade to Pro"}
            </Link>
        </div>
    );
};

export default PricingComponent;
