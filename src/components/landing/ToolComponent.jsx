import React from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const ToolComponent = ({ icon: Icon, title, desc }) => {
    return (
        <Link
            to="/login"
            className="
                group w-full
                rounded-2xl p-6
                bg-slate-900/50
                border border-slate-800
                hover:border-slate-700
                hover:bg-slate-900/80
                hover:-translate-y-1
                flex flex-col gap-4
                transition-all duration-200
            "
        >
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:text-cyan-300 transition-all">
                {Icon && <Icon size={24} />}
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                {title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                {desc}
            </p>

            {/* Action Footer */}
            <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>Open tool</span>
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
};

export default ToolComponent;
