import React, { useState, useRef } from "react";
import {
    FileArchive,
    UploadCloud,
    CheckCircle2,
    Download,
    Loader2,
    RotateCcw,
    Sliders,
    ImageIcon,
    ArrowDownRight,
    Eye
} from "lucide-react";
import { compressImageApi } from "../../../../services/user/UserToolsService";
import { downloadBlob, formatBytes } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

const COMPRESSION_LEVELS = [
    {
        id: "LOW",
        title: "Low Compression",
        description: "Best visual fidelity and highest quality (~80% quality) with moderate file reduction.",
        badge: "Highest Quality",
    },
    {
        id: "MEDIUM",
        title: "Medium Compression",
        description: "Balanced optimization (~50% quality) ideal for web uploads, email, and social sharing.",
        badge: "Recommended",
    },
    {
        id: "HIGH",
        title: "High Compression",
        description: "Maximum file reduction (~20% quality) for minimum file size.",
        badge: "Smallest Size",
    },
];

/**
 * Image Compressor Tool.
 * Connects to: POST /api/users/tools/image-compressor
 * Accepts multipart/form-data: image, toolId, subToolId, level
 */
const ImageCompressorTool = ({ tool }) => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [level, setLevel] = useState("MEDIUM");
    const [loading, setLoading] = useState(false);
    const [compressedBlob, setCompressedBlob] = useState(null);
    const [compressedPreviewUrl, setCompressedPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const toolId = tool?.toolId || 1;
    const subToolId = tool?.subToolId || 1;

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp", "image/gif"];
        if (!validTypes.includes(selectedFile.type) && !/\.(jpe?g|png|webp|bmp|gif)$/i.test(selectedFile.name)) {
            toastError("Please upload a valid image file (JPG, PNG, WebP)");
            return;
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setCompressedBlob(null);
        setCompressedPreviewUrl(null);
    };

    const handleCompress = async () => {
        if (!file) {
            toastError("Please select an image first");
            return;
        }

        setLoading(true);
        try {
            const blob = await compressImageApi({
                image: file,
                toolId,
                subToolId,
                level,
            });

            if (blob instanceof Blob) {
                setCompressedBlob(blob);
                setCompressedPreviewUrl(URL.createObjectURL(blob));
                const outputName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg";
                downloadBlob(blob, outputName);
                toastCustom("Image compressed and downloaded successfully!");
            } else {
                toastError("Unexpected server response format");
            }
        } catch (err) {
            console.error("Image compression error:", err);
            toastError(err?.message || "Failed to compress image");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreviewUrl(null);
        setCompressedBlob(null);
        setCompressedPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Calculate percentage reduction
    const savingsPercent = compressedBlob && file
        ? Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100))
        : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-6xl mx-auto">
            {/* Left Upload & Options Column */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <UploadCloud size={20} className="text-cyan-400" />
                        Select Image to Compress
                    </h2>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/jpeg,image/png,image/webp,image/bmp,image/gif"
                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                        className="hidden"
                    />

                    {!file ? (
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
                                handleFileSelect(e.dataTransfer.files?.[0]);
                            }}
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
                                <ImageIcon size={28} />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                Click to upload or drag & drop your image here
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                JPG, PNG, WebP supported (Up to 20MB)
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                {previewUrl && (
                                    <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                                        <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
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
                                Change Image
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
                            {COMPRESSION_LEVELS.map((lvl) => {
                                const isSelected = level === lvl.id;
                                return (
                                    <div
                                        key={lvl.id}
                                        onClick={() => setLevel(lvl.id)}
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
                                                {lvl.title}
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
                                                {lvl.badge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            {lvl.description}
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
                                    <span>Compressing Image...</span>
                                </>
                            ) : (
                                <>
                                    <FileArchive size={18} />
                                    <span>Compress Image</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Comparison & Result Column */}
            <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col gap-5">
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-cyan-400" />
                        Compression Result
                    </h3>

                    {compressedBlob ? (
                        <div className="flex flex-col items-center text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                            {compressedPreviewUrl && (
                                <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 flex items-center justify-center">
                                    <img
                                        src={compressedPreviewUrl}
                                        alt="Compressed Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}

                            <div className="w-full grid grid-cols-2 gap-2 mt-1">
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                                    <span className="text-[10px] text-slate-400">Original Size</span>
                                    <p className="text-xs font-bold text-slate-200">{formatBytes(file?.size)}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
                                    <span className="text-[10px] text-slate-400">Compressed Size</span>
                                    <p className="text-xs font-bold text-emerald-400">{formatBytes(compressedBlob.size)}</p>
                                </div>
                            </div>

                            {savingsPercent > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    <ArrowDownRight size={14} />
                                    Reduced by {savingsPercent}%
                                </span>
                            )}

                            <button
                                onClick={() => {
                                    const outputName = file?.name ? file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg" : "compressed.jpg";
                                    downloadBlob(compressedBlob, outputName);
                                }}
                                className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md transition"
                            >
                                <Download size={14} />
                                <span>Download Compressed Image</span>
                            </button>

                            <button
                                onClick={handleReset}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mt-1 transition"
                            >
                                <RotateCcw size={12} />
                                <span>Compress Another Image</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-700/80 p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                            <ImageIcon size={32} className="text-slate-600" />
                            <p>Upload an image and click "Compress Image" to view compression metrics and preview.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 space-y-1.5">
                        <p className="font-semibold text-slate-300">Features:</p>
                        <p>• Powered by Java Thumbnailator engine</p>
                        <p>• Retains optimal aspect ratio without distortion</p>
                        <p>• Exports clean, web-ready JPEG format</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompressorTool;
