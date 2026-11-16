import React, { useEffect, useState } from "react";
import { X, ArrowRight, Loader2, Sparkles, Folder, CheckCircle, Clock } from "lucide-react";
import { getSubToolsSuite } from "../../../services/user/UserToolsService";
import { CATEGORY_METADATA, SUB_TOOLS_BY_CATEGORY, TOOLS_CATALOG } from "./toolsRegistry";
import { toastCustom } from "../../../util/toat";

/**
 * Modal that opens when a tool category folder is clicked.
 * Hits GET /api/users/sub-tools-suite?toolId={toolId} to fetch sub-tools.
 */
const SubToolsModal = ({ category, isOpen, onClose, onSelectTool }) => {
    const [subTools, setSubTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toolId = category?.toolId;
    const metadata = CATEGORY_METADATA[toolId] || {};

    useEffect(() => {
        if (!isOpen || !toolId) return;

        let isMounted = true;
        const fetchSubTools = async () => {
            setLoading(true);
            setError(null);
            try {
                // Hits the backend sub-tools-suite endpoint
                const response = await getSubToolsSuite(toolId);
                const rawDetails = response?.data || response?.details || [];

                // Predefined fallback/catalog tools for this category
                const catalogTools = SUB_TOOLS_BY_CATEGORY[toolId] || [];

                /**
                 * Enrich sub-tools:
                 * Even if backend returns generic names or repetitions,
                 * we map them to the full rich catalog so each sub-tool has
                 * an accurate title, icon, and working endpoint.
                 */
                let combined = [];

                if (Array.isArray(rawDetails) && rawDetails.length > 0) {
                    // Map items from server response alongside catalog
                    combined = catalogTools.map((catalogItem, idx) => {
                        const serverItem = rawDetails[idx] || {};
                        return {
                            ...catalogItem,
                            subToolId: serverItem.subToolId || catalogItem.subToolId,
                            serverCategory: serverItem.subToolCategory,
                        };
                    });
                } else {
                    combined = catalogTools;
                }

                if (isMounted) {
                    setSubTools(combined);
                }
            } catch (err) {
                console.warn("Using catalog fallback for sub-tools:", err);
                if (isMounted) {
                    // Seamless fallback if network or endpoint has temporary issue
                    setSubTools(SUB_TOOLS_BY_CATEGORY[toolId] || []);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchSubTools();

        // Close on Escape key press
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            isMounted = false;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, toolId]);

    if (!isOpen || !category) return null;

    const handleToolClick = (tool) => {
        if (!tool.isAvailable) {
            toastCustom(`${tool.name} is scheduled for an upcoming release!`);
            return;
        }
        onSelectTool(tool);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="
                    relative w-full max-w-2xl
                    rounded-3xl border border-slate-700/80
                    bg-[#0B1220]/95 backdrop-blur-2xl
                    shadow-2xl shadow-cyan-950/40
                    overflow-hidden flex flex-col max-h-[88vh]
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div
                            className={`
                                flex items-center justify-center
                                h-11 w-11 rounded-xl
                                bg-gradient-to-br ${metadata.gradient || "from-cyan-500/20 to-blue-500/20"}
                                border border-white/10 text-cyan-300
                            `}
                        >
                            <Folder size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
                                    Tool Suite Folder
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                                    ID: {category.toolId}
                                </span>
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">
                                {category.toolCategory}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body / Sub-tools list */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 size={32} className="animate-spin text-cyan-400" />
                            <p className="text-sm text-slate-400">Loading sub-tools from suite...</p>
                        </div>
                    ) : subTools.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {subTools.map((tool) => {
                                const IconComponent = tool.icon || Sparkles;
                                return (
                                    <div
                                        key={tool.slug || tool.name}
                                        onClick={() => handleToolClick(tool)}
                                        className={`
                                            group relative flex flex-col justify-between
                                            rounded-2xl border p-4 sm:p-4.5 transition-all duration-200 cursor-pointer
                                            ${tool.isAvailable
                                                ? "border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
                                                : "border-slate-800/50 bg-slate-900/30 opacity-75 hover:opacity-100 hover:border-slate-700"
                                            }
                                        `}
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div
                                                className={`
                                                    p-2.5 rounded-xl border
                                                    ${tool.isAvailable
                                                        ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300 group-hover:scale-105"
                                                        : "bg-slate-800 border-slate-700 text-slate-400"
                                                    }
                                                    transition-transform
                                                `}
                                            >
                                                <IconComponent size={20} />
                                            </div>

                                            {tool.isAvailable ? (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                    <CheckCircle size={10} />
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                                    <Clock size={10} />
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                                                {tool.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                {tool.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                                            <span className={tool.isAvailable ? "text-cyan-400" : "text-slate-500"}>
                                                {tool.isAvailable ? "Launch Tool" : "In Development"}
                                            </span>
                                            <ArrowRight
                                                size={14}
                                                className={`
                                                    ${tool.isAvailable
                                                        ? "text-cyan-400 group-hover:translate-x-1"
                                                        : "text-slate-600"
                                                    }
                                                    transition-transform
                                                `}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            No sub-tools found for this category.
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        Select a tool to launch its interactive controller workspace.
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubToolsModal;
