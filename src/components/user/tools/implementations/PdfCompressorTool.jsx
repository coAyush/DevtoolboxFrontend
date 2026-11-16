import React, { useState, useRef } from "react";
import {
    FileArchive,
    UploadCloud,
    FileText,
    CheckCircle2,
    Download,
    Loader2,
    AlertCircle,
    RotateCcw,
    Sliders
} from "lucide-react";
import { compressPdfApi } from "../../../../services/user/UserToolsService";
import { downloadBlob, formatBytes } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

const COMPRESSION_LEVELS = [
    {
        id: "LOW",
        title: "Low Compression",
        description: "Best visual fidelity and high-res print quality with slight size reduction.",
        badge: "Highest Quality",
    },
    {
        id: "MEDIUM",
        title: "Medium Compression",
        description: "Balanced ratio ideal for eBooks, documents, and web sharing (Recommended).",
        badge: "Recommended",
    },
    {
        id: "HIGH",
        title: "High Compression",
        description: "Maximum file size reduction optimized for email attachments and screens.",
        badge: "Smallest Size",
    },
];

/**
 * PDF Compressor tool component.
 * Connects to: POST /api/users/tools/pdf-compressor
 */
const PdfCompressorTool = ({ tool }) => {
    const [file, setFile] = useState(null);
    const [compressionLevel, setCompressionLevel] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);
    const [compressedBlob, setCompressedBlob] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
            toastError("Please upload a valid PDF document (.pdf)");
            return;
        }
        setFile(selectedFile);
        setCompressedBlob(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        handleFileSelect(droppedFile);
    };

    const handleCompress = async () => {
        if (!file) {
            toastError("Please choose a PDF file first");
            return;
        }

        setLoading(true);
        try {
            const blob = await compressPdfApi({
                file,
                toolId: tool?.toolId || 3,
                subToolId: tool?.subToolId || 3,
                compressionLevel,
            });

            if (blob instanceof Blob) {
                setCompressedBlob(blob);
                const suggestedName = file.name.replace(/\.pdf$/i, "") + "_compressed.pdf";
                downloadBlob(blob, suggestedName);
                toastCustom("PDF compressed and downloaded successfully!");
            } else {
                toastError("Failed to receive compressed PDF from server");
            }
        } catch (err) {
            console.error("Compression error:", err);
            toastError(err?.message || "Failed to compress PDF file");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setCompressedBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Upload & Options Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <UploadCloud size={20} className="text-cyan-400" />
                        Select PDF Document
                    </h2>

                    {/* Drag and drop zone */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,application/pdf"
                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                        className="hidden"
                    />

                    {!file ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`
                                border-2 border-dashed rounded-2xl p-8 sm:p-12
                                flex flex-col items-center justify-center text-center cursor-pointer
                                transition-all duration-200
                                ${isDragging
                                    ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                                    : "border-slate-700/80 bg-slate-900/40 hover:border-cyan-500/50 hover:bg-slate-900/70"
                                }
                            `}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                                <UploadCloud size={28} />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                Click to upload or drag & drop your PDF here
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Supports PDF files up to 25MB
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Original Size: <span className="text-cyan-400 font-semibold">{formatBytes(file.size)}</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="self-end sm:self-auto text-xs px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            >
                                Change File
                            </button>
                        </div>
                    )}

                    {/* Compression Level Presets */}
                    <div className="mt-7">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-3">
                            <Sliders size={14} className="text-cyan-400" />
                            Select Compression Level
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {COMPRESSION_LEVELS.map((level) => {
                                const isSelected = compressionLevel === level.id;
                                return (
                                    <div
                                        key={level.id}
                                        onClick={() => setCompressionLevel(level.id)}
                                        className={`
                                            p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between
                                            ${isSelected
                                                ? "bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/15"
                                                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-white">
                                                {level.title}
                                            </span>
                                            <span
                                                className={`
                                                    text-[10px] font-semibold px-2 py-0.5 rounded-full border
                                                    ${isSelected
                                                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                                        : "bg-slate-800 text-slate-400 border-slate-700"
                                                    }
                                                `}
                                            >
                                                {level.badge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            {level.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-7">
                        <button
                            onClick={handleCompress}
                            disabled={loading || !file}
                            className={`
                                w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white
                                flex items-center justify-center gap-2 transition-all duration-200
                                ${loading || !file
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer"
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-white" />
                                    <span>Compressing PDF with GhostScript...</span>
                                </>
                            ) : (
                                <>
                                    <FileArchive size={18} />
                                    <span>Compress PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Status / Result Column */}
            <div className="lg:col-span-4">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col gap-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-cyan-400" />
                        Compression Status
                    </h3>

                    {compressedBlob ? (
                        <div className="flex flex-col items-center text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Compression Complete!</h4>
                                <p className="text-xs text-slate-300 mt-1">
                                    Compressed Size: <span className="font-semibold text-emerald-400">{formatBytes(compressedBlob.size)}</span>
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    const suggestedName = file?.name ? file.name.replace(/\.pdf$/i, "") + "_compressed.pdf" : "compressed.pdf";
                                    downloadBlob(compressedBlob, suggestedName);
                                }}
                                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md transition"
                            >
                                <Download size={14} />
                                <span>Download PDF Again</span>
                            </button>

                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-1 transition"
                            >
                                <RotateCcw size={12} />
                                <span>Compress Another File</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-700/80 p-6 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                            <FileArchive size={32} className="text-slate-600" />
                            <p>Upload a PDF file and choose your desired compression level to start shrinking.</p>
                        </div>
                    )}

                    {/* How It Works Info */}
                    <div className="border-t border-slate-800/80 pt-4">
                        <h4 className="text-xs font-semibold text-slate-300 mb-2">How it works</h4>
                        <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
                            <li>Re-samples high-res embedded graphics safely</li>
                            <li>Removes redundant document metadata</li>
                            <li>Generates standard compliant compact PDF streams</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfCompressorTool;
