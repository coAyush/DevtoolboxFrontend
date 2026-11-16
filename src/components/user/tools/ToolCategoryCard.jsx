import React from "react";
import { Folder, FolderOpen, ArrowRight, Sparkles } from "lucide-react";
import { CATEGORY_METADATA } from "./toolsRegistry";

/**
 * Category folder card rendered on the main Tool Suite page.
 * Displays category title, description, badge, and triggers the sub-tools modal.
 */
const ToolCategoryCard = ({ category, onOpenModal }) => {
    const { toolId, toolCategory, toolCount } = category;
    const metadata = CATEGORY_METADATA[toolId] || {
        title: toolCategory || `Category ${toolId}`,
        description: "Explore productive tools in this category.",
        icon: Folder,
        gradient: "from-cyan-500/20 to-blue-500/20",
        borderAccent: "hover:border-cyan-500/50",
        glowColor: "rgba(6, 182, 212, 0.15)",
        badge: "Tool Suite",
    };

    const Icon = metadata.icon || Folder;

    return (
        <div
            onClick={() => onOpenModal(category)}
            className={`
                group relative flex flex-col justify-between
                rounded-2xl border border-slate-800/80 bg-slate-900/60
                backdrop-blur-xl p-5 sm:p-6
                transition-all duration-300 ease-out cursor-pointer
                hover:-translate-y-1 hover:bg-slate-900/90
                ${metadata.borderAccent}
                shadow-lg hover:shadow-[0_0_30px_var(--glow-color)]
            `}
            style={{ "--glow-color": metadata.glowColor }}
        >
            {/* Folder Header Motif */}
            <div className="flex items-start justify-between gap-3 mb-4">
                <div
                    className={`
                        flex items-center justify-center
                        h-13 w-13 rounded-xl
                        bg-gradient-to-br ${metadata.gradient}
                        border border-white/10
                        text-cyan-300 group-hover:scale-105
                        transition-transform duration-300
                    `}
                >
                    <Icon size={26} strokeWidth={1.8} />
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-cyan-300 border border-cyan-500/20">
                        <Sparkles size={11} className="text-cyan-400" />
                        {toolCount ? `${toolCount} tools` : "Active"}
                    </span>
                </div>
            </div>

            {/* Folder Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                    <Folder className="text-slate-500 group-hover:text-cyan-400 transition-colors" size={16} />
                    <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {toolCategory || metadata.title}
                    </h2>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 mt-1">
                    {metadata.description}
                </p>
            </div>

            {/* Folder Bottom Action Bar */}
            <div className="mt-5 pt-3.5 border-t border-slate-800/70 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    Open Folder
                </span>
                <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Browse tools</span>
                    <ArrowRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ToolCategoryCard;
