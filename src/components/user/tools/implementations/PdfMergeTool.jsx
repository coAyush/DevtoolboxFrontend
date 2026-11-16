import React, { useState, useRef } from "react";
import {
    FileStack,
    UploadCloud,
    FileText,
    CheckCircle2,
    Download,
    Loader2,
    RotateCcw,
    X,
    ChevronUp,
    ChevronDown,
    AlertCircle
} from "lucide-react";
import { mergePdfApi } from "../../../../services/user/UserToolsService";
import { downloadBlob, formatBytes } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

/**
 * PDF Merger tool component.
 * Merges multiple PDFs (2 to 20 files) in the order provided.
 * Connects to: POST /api/users/tools
 */
const PdfMergeTool = ({ tool }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mergedBlob, setMergedBlob] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (incomingFiles) => {
        if (!incomingFiles || incomingFiles.length === 0) return;

        const newPdfs = [];
        for (const file of incomingFiles) {
            if (files.length + newPdfs.length >= 20) {
                toastError("Maximum 20 PDF files allowed");
                break;
            }
            if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
                toastError(`File "${file.name}" is not a PDF`);
                continue;
            }
            newPdfs.push(file);
        }

        if (newPdfs.length > 0) {
            setFiles((prev) => [...prev, ...newPdfs]);
            setMergedBlob(null);
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const moveFile = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= files.length) return;
        const updated = [...files];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;
        setFiles(updated);
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            toastError("Please select at least 2 PDF files to merge");
            return;
        }

        setLoading(true);
        try {
            const blob = await mergePdfApi({
                files,
                toolId: tool?.toolId || 3,
                subToolId: tool?.subToolId || 1,
            });

            if (blob instanceof Blob) {
                setMergedBlob(blob);
                downloadBlob(blob, `merged_${Date.now()}.pdf`);
                toastCustom("PDFs merged and downloaded successfully!");
            } else {
                toastError("Failed to receive merged PDF from server");
            }
        } catch (err) {
            console.error("Merge error:", err);
            toastError(err?.message || "Failed to merge PDF files");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setMergedBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Upload & List Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <FileStack size={20} className="text-cyan-400" />
                            Upload & Arrange PDFs
                        </h2>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${files.length >= 2 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                            {files.length} / 20 Files (Min 2 required)
                        </span>
                    </div>

                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />

                    {/* Drag and Drop Zone */}
                    <div
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            handleFiles(e.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            border-2 border-dashed rounded-2xl p-6 sm:p-8
                            flex flex-col items-center justify-center text-center cursor-pointer
                            transition-all duration-200
                            ${isDragging
                                ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                                : "border-slate-700/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/70"
                            }
                        `}
                    >
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                            <UploadCloud size={24} />
                        </div>
                        <p className="text-sm font-semibold text-white">
                            Select multiple PDF documents or drop them here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Between 2 and 20 PDFs (Order can be rearranged below)
                        </p>
                    </div>

                    {/* Ordered Files List */}
                    {files.length > 0 && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400">
                                <span>Merge Sequence (Top to Bottom)</span>
                                <button
                                    onClick={handleReset}
                                    className="text-rose-400 hover:text-rose-300"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-2 max-h-72 overflow-y-auto p-1">
                                {files.map((f, idx) => (
                                    <div
                                        key={idx}
                                        className="
                                            flex items-center justify-between p-3 rounded-xl
                                            border border-slate-800 bg-slate-900/60 hover:bg-slate-900
                                            transition-all gap-3
                                        "
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-slate-800 text-[11px] font-bold text-cyan-400 shrink-0">
                                                {idx + 1}
                                            </span>
                                            <FileText size={18} className="text-slate-400 shrink-0" />
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white truncate">{f.name}</p>
                                                <p className="text-[10px] text-slate-500">{formatBytes(f.size)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                type="button"
                                                disabled={idx === 0}
                                                onClick={() => moveFile(idx, -1)}
                                                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move up in order"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={idx === files.length - 1}
                                                onClick={() => moveFile(idx, 1)}
                                                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Move down in order"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(idx)}
                                                className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
                                                title="Remove file"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Merge Action Button */}
                    <div className="mt-7">
                        <button
                            onClick={handleMerge}
                            disabled={loading || files.length < 2}
                            className={`
                                w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white
                                flex items-center justify-center gap-2 transition-all duration-200
                                ${loading || files.length < 2
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer"
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-white" />
                                    <span>Merging PDF Documents...</span>
                                </>
                            ) : (
                                <>
                                    <FileStack size={18} />
                                    <span>Merge {files.length} PDFs</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Status Column */}
            <div className="lg:col-span-4">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col gap-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-cyan-400" />
                        Merge Status
                    </h3>

                    {mergedBlob ? (
                        <div className="flex flex-col items-center text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Merge Successful!</h4>
                                <p className="text-xs text-slate-300 mt-1">
                                    Combined: <span className="font-semibold text-emerald-400">{files.length} PDFs</span> ({formatBytes(mergedBlob.size)})
                                </p>
                            </div>

                            <button
                                onClick={() => downloadBlob(mergedBlob, "merged.pdf")}
                                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md transition"
                            >
                                <Download size={14} />
                                <span>Download Merged PDF Again</span>
                            </button>

                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-1 transition"
                            >
                                <RotateCcw size={12} />
                                <span>Merge New Files</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-700/80 p-6 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                            <FileStack size={32} className="text-slate-600" />
                            <p>Select at least 2 PDF files to begin merging. Reorder items using the arrows if needed.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 space-y-1.5">
                        <p className="font-semibold text-slate-300">Features:</p>
                        <p>• Seamless sequence reordering</p>
                        <p>• Retains vector clarity and bookmarks</p>
                        <p>• Max combined page limit: 500 pages</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfMergeTool;
