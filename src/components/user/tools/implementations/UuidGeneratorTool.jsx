import React, { useState, useEffect } from "react";
import {
    Hash,
    Sparkles,
    Copy,
    Check,
    Download,
    RefreshCw,
    Sliders,
    Layers,
    FileText,
    CheckCircle2
} from "lucide-react";
import { logToolUsageApi } from "../../../../services/user/UserToolsService";
import { toastCustom } from "../../../../util/toat";

/**
 * Generate a single UUID v4
 */
const generateSingleUuid = (uppercase, hyphens, wrapMode) => {
    let id = "";
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        id = crypto.randomUUID();
    } else {
        // Fallback for environments without crypto.randomUUID
        id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    if (!hyphens) {
        id = id.replace(/-/g, "");
    }
    if (uppercase) {
        id = id.toUpperCase();
    }
    if (wrapMode === "braces") {
        id = `{${id}}`;
    } else if (wrapMode === "quotes") {
        id = `"${id}"`;
    }

    return id;
};

/**
 * UUID Generator Tool.
 * Logs tool usage to: POST /api/users/tools/log-usage?toolId=2&subToolId=2
 */
const UuidGeneratorTool = ({ tool }) => {
    const [quantity, setQuantity] = useState(5);
    const [uppercase, setUppercase] = useState(false);
    const [hyphens, setHyphens] = useState(true);
    const [wrapMode, setWrapMode] = useState("none"); // "none", "braces", "quotes"
    const [uuidList, setUuidList] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedAll, setCopiedAll] = useState(false);

    const toolId = tool?.toolId || 2;
    const subToolId = tool?.subToolId || 2;

    const generateBatch = () => {
        const count = Math.max(1, Math.min(quantity, 50));
        const list = [];
        for (let i = 0; i < count; i++) {
            list.push(generateSingleUuid(uppercase, hyphens, wrapMode));
        }
        setUuidList(list);

        // Log tool usage to backend
        logToolUsageApi({ toolId, subToolId });
    };

    // Generate initial batch on mount
    useEffect(() => {
        generateBatch();
    }, []);

    const handleCopyItem = (uuid, index) => {
        navigator.clipboard.writeText(uuid);
        setCopiedIndex(index);
        toastCustom("UUID copied to clipboard");
        setTimeout(() => setCopiedIndex(null), 1500);
    };

    const handleCopyAll = () => {
        if (uuidList.length === 0) return;
        const text = uuidList.join("\n");
        navigator.clipboard.writeText(text);
        setCopiedAll(true);
        toastCustom(`Copied all ${uuidList.length} UUIDs`);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    const handleDownloadTxt = () => {
        if (uuidList.length === 0) return;
        const blob = new Blob([uuidList.join("\n")], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `uuids_${Date.now()}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        toastCustom("Downloaded UUID list (.txt)");
    };

    const handleDownloadJson = () => {
        if (uuidList.length === 0) return;
        const blob = new Blob([JSON.stringify(uuidList, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `uuids_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toastCustom("Downloaded UUID list (.json)");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-6xl mx-auto">
            {/* Left Parameters & Options Column */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                        <Sliders size={20} className="text-cyan-400" />
                        UUID Parameters
                    </h2>

                    {/* Quantity Preset */}
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-xs font-semibold text-slate-300">
                            Number of UUIDs to Generate
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 5, 10, 20, 50].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setQuantity(num)}
                                    className={`
                                        py-2 rounded-xl text-xs font-bold border transition-all text-center
                                        ${quantity === num
                                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm"
                                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                                        }
                                    `}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Character Casing */}
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-xs font-semibold text-slate-300">Letter Casing</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setUppercase(false)}
                                className={`
                                    py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                                    ${!uppercase
                                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300"
                                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                                    }
                                `}
                            >
                                lowercase (standard)
                            </button>
                            <button
                                type="button"
                                onClick={() => setUppercase(true)}
                                className={`
                                    py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                                    ${uppercase
                                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300"
                                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                                    }
                                `}
                            >
                                UPPERCASE
                            </button>
                        </div>
                    </div>

                    {/* Hyphens Toggle */}
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-xs font-semibold text-slate-300">Hyphen Delimiters</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setHyphens(true)}
                                className={`
                                    py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                                    ${hyphens
                                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300"
                                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                                    }
                                `}
                            >
                                Include Hyphens (-)
                            </button>
                            <button
                                type="button"
                                onClick={() => setHyphens(false)}
                                className={`
                                    py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                                    ${!hyphens
                                        ? "bg-cyan-500/15 border-cyan-400 text-cyan-300"
                                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                                    }
                                `}
                            >
                                Strip Hyphens
                            </button>
                        </div>
                    </div>

                    {/* Wrapping Mode */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="text-xs font-semibold text-slate-300">Enclosing Characters</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: "none", label: "None" },
                                { id: "braces", label: "{ Braces }" },
                                { id: "quotes", label: '" Quotes "' },
                            ].map((mode) => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setWrapMode(mode.id)}
                                    className={`
                                        py-2 px-2 rounded-xl text-xs font-medium border transition-all text-center
                                        ${wrapMode === mode.id
                                            ? "bg-purple-500/15 border-purple-400 text-purple-300"
                                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                                        }
                                    `}
                                >
                                    {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        type="button"
                        onClick={generateBatch}
                        className="
                            w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white
                            bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600
                            hover:from-cyan-400 hover:to-indigo-500 shadow-lg shadow-cyan-500/25
                            active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2
                            transition-all duration-200
                        "
                    >
                        <RefreshCw size={18} />
                        <span>Generate {quantity} UUIDs</span>
                    </button>
                </div>
            </div>

            {/* Right Output Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles size={18} className="text-cyan-400" />
                                Generated Identifiers ({uuidList.length})
                            </h3>
                            <span className="text-[11px] text-slate-500 font-medium">
                                RFC4122 Version 4 Cryptographically Random
                            </span>
                        </div>

                        {uuidList.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyAll}
                                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-white flex items-center gap-1.5 transition shadow-sm"
                                >
                                    {copiedAll ? <Check size={14} /> : <Copy size={14} />}
                                    <span>{copiedAll ? "Copied All" : "Copy All"}</span>
                                </button>

                                <button
                                    onClick={handleDownloadTxt}
                                    className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    title="Download as .txt"
                                >
                                    <Download size={15} />
                                </button>
                                <button
                                    onClick={handleDownloadJson}
                                    className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                                    title="Download as .json"
                                >
                                    <FileText size={15} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* UUID list items */}
                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                        {uuidList.map((uuid, idx) => (
                            <div
                                key={idx}
                                className="
                                    flex items-center justify-between p-3 rounded-xl
                                    border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900
                                    hover:border-cyan-500/30 transition-all gap-3 group
                                "
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-[11px] font-bold text-slate-500 shrink-0 w-5">
                                        #{idx + 1}
                                    </span>
                                    <span className="font-mono text-xs sm:text-sm text-cyan-300 font-semibold truncate select-all">
                                        {uuid}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleCopyItem(uuid, idx)}
                                    className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition shrink-0"
                                    title="Copy this UUID"
                                >
                                    {copiedIndex === idx ? (
                                        <Check size={14} className="text-emerald-400" />
                                    ) : (
                                        <Copy size={14} />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UuidGeneratorTool;
