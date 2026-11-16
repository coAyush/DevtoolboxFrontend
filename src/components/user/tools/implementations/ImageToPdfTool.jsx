import React, { useState, useRef } from "react";
import {
    Images,
    UploadCloud,
    X,
    FileText,
    CheckCircle2,
    Download,
    Loader2,
    RotateCcw,
    Layers,
    FileCheck
} from "lucide-react";
import { imageToPdfApi } from "../../../../services/user/UserToolsService";
import { downloadBlob, formatBytes } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

/**
 * Image to PDF converter tool component.
 * Connects to: POST /api/users/tools/image-to-pdf
 */
const ImageToPdfTool = ({ tool }) => {
    const [images, setImages] = useState([]);
    const [pageMode, setPageMode] = useState("FIT_IMAGE"); // FIT_IMAGE or A4
    const [loading, setLoading] = useState(false);
    const [convertedBlob, setConvertedBlob] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFiles = (incomingFiles) => {
        if (!incomingFiles || incomingFiles.length === 0) return;

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
        const newImages = [];

        for (const file of incomingFiles) {
            if (images.length + newImages.length >= 20) {
                toastError("Maximum 20 images allowed at a time");
                break;
            }
            if (!validTypes.includes(file.type) && !/\.(jpe?g|png|gif|bmp)$/i.test(file.name)) {
                toastError(`File "${file.name}" is not a supported image format`);
                continue;
            }
            newImages.push(file);
        }

        if (newImages.length > 0) {
            setImages((prev) => [...prev, ...newImages]);
            setConvertedBlob(null);
        }
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (images.length === 0) {
            toastError("Please upload at least one image");
            return;
        }

        setLoading(true);
        try {
            const blob = await imageToPdfApi({
                files: images,
                toolId: tool?.toolId || 3,
                subToolId: tool?.subToolId || 5,
                pageMode,
            });

            if (blob instanceof Blob) {
                setConvertedBlob(blob);
                downloadBlob(blob, `images_${Date.now()}.pdf`);
                toastCustom("Images converted to PDF successfully!");
            } else {
                toastError("Failed to receive PDF from server");
            }
        } catch (err) {
            console.error("Image to PDF error:", err);
            toastError(err?.message || "Failed to convert images to PDF");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setImages([]);
        setConvertedBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Upload & Image List Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Images size={20} className="text-cyan-400" />
                            Upload Images
                        </h2>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {images.length} / 20 Images
                        </span>
                    </div>

                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept="image/png,image/jpeg,image/gif,image/bmp"
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                    />

                    {/* Drag and Drop Box */}
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
                            Select images or drop them here
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            PNG, JPG, GIF, BMP supported (Up to 20 images)
                        </p>
                    </div>

                    {/* Image Thumbnails Gallery */}
                    {images.length > 0 && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400">
                                <span>Selected Images (In Order of PDF Pages)</span>
                                <button
                                    onClick={handleReset}
                                    className="text-rose-400 hover:text-rose-300"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1">
                                {images.map((img, idx) => {
                                    const previewUrl = URL.createObjectURL(img);
                                    return (
                                        <div
                                            key={idx}
                                            className="
                                                group relative rounded-xl border border-slate-700/80 bg-slate-900/80
                                                p-2 flex flex-col items-center overflow-hidden
                                            "
                                        >
                                            <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                                                <img
                                                    src={previewUrl}
                                                    alt={img.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div className="w-full mt-1.5 flex items-center justify-between text-[11px]">
                                                <span className="text-slate-300 truncate max-w-[80%] font-medium">
                                                    Page {idx + 1}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeImage(idx);
                                                    }}
                                                    className="text-slate-400 hover:text-rose-400 transition"
                                                >
                                                    <X size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Page Mode Selector */}
                    <div className="mt-6 pt-5 border-t border-slate-800">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-3">
                            <Layers size={14} className="text-cyan-400" />
                            PDF Page Dimensions Format
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div
                                onClick={() => setPageMode("FIT_IMAGE")}
                                className={`
                                    p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between
                                    ${pageMode === "FIT_IMAGE"
                                        ? "bg-cyan-500/10 border-cyan-400 shadow-sm"
                                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                    }
                                `}
                            >
                                <div className="text-xs font-bold text-white mb-1">Fit Image (Default)</div>
                                <div className="text-[11px] text-slate-400">
                                    Each PDF page exactly matches the dimensions and aspect ratio of each image.
                                </div>
                            </div>

                            <div
                                onClick={() => setPageMode("A4")}
                                className={`
                                    p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between
                                    ${pageMode === "A4"
                                        ? "bg-cyan-500/10 border-cyan-400 shadow-sm"
                                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                                    }
                                `}
                            >
                                <div className="text-xs font-bold text-white mb-1">Standard A4 Format</div>
                                <div className="text-[11px] text-slate-400">
                                    Standard document size. Images are auto-centered with proportional scaling.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Convert Button */}
                    <div className="mt-7">
                        <button
                            onClick={handleConvert}
                            disabled={loading || images.length === 0}
                            className={`
                                w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white
                                flex items-center justify-center gap-2 transition-all duration-200
                                ${loading || images.length === 0
                                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                    : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer"
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-white" />
                                    <span>Generating PDF Document...</span>
                                </>
                            ) : (
                                <>
                                    <FileCheck size={18} />
                                    <span>Convert Images to PDF</span>
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
                        Conversion Status
                    </h3>

                    {convertedBlob ? (
                        <div className="flex flex-col items-center text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">PDF Created Successfully!</h4>
                                <p className="text-xs text-slate-300 mt-1">
                                    Generated: <span className="font-semibold text-emerald-400">{images.length} pages</span> ({formatBytes(convertedBlob.size)})
                                </p>
                            </div>

                            <button
                                onClick={() => downloadBlob(convertedBlob, "images.pdf")}
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
                                <span>Convert More Images</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-700/80 p-6 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                            <Images size={32} className="text-slate-600" />
                            <p>Upload your image files and click "Convert Images to PDF" to generate your document.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 space-y-1.5">
                        <p className="font-semibold text-slate-300">Tips:</p>
                        <p>• Drag or select multiple photos simultaneously</p>
                        <p>• Max total file size: 30MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageToPdfTool;
