import React, { useState, useRef } from "react";
import {
    FileSpreadsheet,
    UploadCloud,
    FileText,
    CheckCircle2,
    Download,
    Loader2,
    RotateCcw
} from "lucide-react";
import { wordToPdfApi } from "../../../../services/user/UserToolsService";
import { downloadBlob, formatBytes } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

/**
 * Word (.docx) to PDF conversion tool.
 * Connects to: POST /api/users/tools/word-to-pdf
 */
const WordToPdfTool = ({ tool }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [convertedBlob, setConvertedBlob] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.name.toLowerCase().endsWith(".docx")) {
            toastError("Only modern Microsoft Word (.docx) documents are supported");
            return;
        }
        setFile(selectedFile);
        setConvertedBlob(null);
    };

    const handleConvert = async () => {
        if (!file) {
            toastError("Please choose a Word (.docx) document first");
            return;
        }

        setLoading(true);
        try {
            const blob = await wordToPdfApi({
                file,
                toolId: tool?.toolId || 3,
                subToolId: tool?.subToolId || 4,
            });

            if (blob instanceof Blob) {
                setConvertedBlob(blob);
                const pdfName = file.name.replace(/\.docx$/i, "") + ".pdf";
                downloadBlob(blob, pdfName);
                toastCustom("Word document converted to PDF successfully!");
            } else {
                toastError("Failed to receive converted PDF from server");
            }
        } catch (err) {
            console.error("Word to PDF error:", err);
            toastError(err?.message || "Failed to convert Word document");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setConvertedBlob(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Upload Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <UploadCloud size={20} className="text-cyan-400" />
                        Select Microsoft Word File (.docx)
                    </h2>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
                                <FileSpreadsheet size={28} />
                            </div>
                            <p className="text-sm font-semibold text-white">
                                Click to upload or drag & drop your Word file here
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Modern .docx files supported (Up to 10MB)
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{file.name}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Size: <span className="text-cyan-400 font-semibold">{formatBytes(file.size)}</span>
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

                    {/* Convert Button */}
                    <div className="mt-7">
                        <button
                            onClick={handleConvert}
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
                                    <span>Rendering Word Document to PDF...</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={18} />
                                    <span>Convert Word to PDF</span>
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
                        Conversion Status
                    </h3>

                    {convertedBlob ? (
                        <div className="flex flex-col items-center text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl gap-3">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Conversion Complete!</h4>
                                <p className="text-xs text-slate-300 mt-1">
                                    Generated PDF: <span className="font-semibold text-emerald-400">{formatBytes(convertedBlob.size)}</span>
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    const pdfName = file?.name ? file.name.replace(/\.docx$/i, "") + ".pdf" : "converted.pdf";
                                    downloadBlob(convertedBlob, pdfName);
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
                                <span>Convert Another File</span>
                            </button>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-700/80 p-6 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                            <FileSpreadsheet size={32} className="text-slate-600" />
                            <p>Upload a .docx document and click "Convert Word to PDF" to generate a standardized PDF.</p>
                        </div>
                    )}

                    <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-400 space-y-1.5">
                        <p className="font-semibold text-slate-300">Supported formats:</p>
                        <p>• Microsoft Word 2007+ (.docx)</p>
                        <p>• Max file size: 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordToPdfTool;
