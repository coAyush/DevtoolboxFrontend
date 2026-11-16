import React from "react";
import { ArrowLeft, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { NavLink } from "react-router";

/**
 * Reusable wrapper providing clean breadcrumb navigation,
 * consistent header, category badges, and unified styling
 * for all interactive tool pages.
 */
const ToolPageWrapper = ({
    tool,
    categoryName,
    onBack,
    children
}) => {
    const Icon = tool.icon || Sparkles;

    return (
        <div className="w-full flex flex-col gap-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
            {/* Top Breadcrumb & Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <NavLink
                        to="/user/tools"
                        onClick={onBack}
                        className="hover:text-cyan-400 transition-colors font-medium"
                    >
                        Tool Suite
                    </NavLink>
                    <ChevronRight size={14} className="text-slate-600" />
                    <span className="text-slate-400 font-medium">
                        {categoryName || tool.categoryName || "Category"}
                    </span>
                    <ChevronRight size={14} className="text-slate-600" />
                    <span className="text-cyan-400 font-semibold">
                        {tool.name}
                    </span>
                </div>

                <button
                    onClick={onBack}
                    className="
                        inline-flex items-center gap-2 self-start sm:self-auto
                        px-3.5 py-1.5 rounded-xl border border-slate-700/80
                        bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white
                        text-xs font-semibold transition-all duration-200
                        hover:border-slate-600 shadow-sm
                    "
                >
                    <ArrowLeft size={14} />
                    <span>Back to Tool Suite</span>
                </button>
            </div>

            {/* Tool Header Banner */}
            <div
                className="
                    relative overflow-hidden rounded-3xl
                    border border-cyan-500/20 bg-gradient-to-r
                    from-[#0B1528] via-[#091122] to-[#070D1B]
                    p-6 sm:p-8 shadow-xl shadow-cyan-950/20
                "
            >
                {/* Background ambient glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-start sm:items-center gap-4">
                        <div
                            className="
                                flex items-center justify-center shrink-0
                                h-14 w-14 sm:h-16 sm:w-16 rounded-2xl
                                bg-gradient-to-br from-cyan-400/20 to-blue-500/20
                                border border-cyan-400/30 text-cyan-300
                                shadow-lg shadow-cyan-500/10
                            "
                        >
                            <Icon size={32} strokeWidth={1.8} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                    <Sparkles size={11} />
                                    {categoryName || tool.categoryName || "Tool"}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    <CheckCircle2 size={11} />
                                    Live Controller
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {tool.name}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                                {tool.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Interactive Workspace Area */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
};

export default ToolPageWrapper;
