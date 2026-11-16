import React, { useState, useEffect } from "react";
import {
    QrCode,
    Sparkles,
    Download,
    Copy,
    Check,
    ExternalLink,
    Loader2,
    RefreshCw,
    History,
    Link as LinkIcon
} from "lucide-react";
import { generateQrCodeApi } from "../../../../services/user/UserToolsService";
import { downloadFromUrl } from "../fileDownloadHelper";
import { toastCustom, toastError } from "../../../../util/toat";

const SIZE_PRESETS = [
    { label: "Small (200px)", value: 200 },
    { label: "Medium (300px)", value: 300 },
    { label: "Large (400px)", value: 400 },
    { label: "HD (500px)", value: 500 },
];

/**
 * QR Code Controller & Generator tool.
 * Connects to: POST /api/users/tools/qr-code
 */
const QrCodeTool = ({ tool }) => {
    const [url, setUrl] = useState("");
    const [size, setSize] = useState(300);
    const [loading, setLoading] = useState(false);
    const [qrResultUrl, setQrResultUrl] = useState(null);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState([]);

    // Load recent history from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem("devtoolbox_recent_qrs");
            if (saved) setHistory(JSON.parse(saved));
        } catch {
            // ignore localStorage errors
        }
    }, []);

    const saveToHistory = (item) => {
        try {
            const updated = [item, ...history.filter(h => h.url !== item.url)].slice(0, 6);
            setHistory(updated);
            localStorage.setItem("devtoolbox_recent_qrs", JSON.stringify(updated));
        } catch {
            // ignore
        }
    };

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();
        const trimmed = url.trim();
        if (!trimmed) {
            toastError("Please enter a valid URL or text to generate a QR Code");
            return;
        }

        setLoading(true);
        try {
            const response = await generateQrCodeApi({
                toolId: tool?.toolId || 2,
                toolSubId: tool?.subToolId || 1,
                url: trimmed,
                width: size,
                height: size,
            });

            // Endpoint returns { data: "https://cloudinary..." } or details
            const resultUrl = response?.data || response?.details || response;
            if (typeof resultUrl === "string" && resultUrl.startsWith("http")) {
                setQrResultUrl(resultUrl);
                toastCustom("QR Code generated successfully!");
                saveToHistory({
                    url: trimmed,
                    qrUrl: resultUrl,
                    date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    size,
                });
            } else {
                toastError("Unable to load QR Code from server response");
            }
        } catch (err) {
            console.error("QR Code Error:", err);
            toastError(err?.message || "Failed to generate QR Code");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (!qrResultUrl) return;
        navigator.clipboard.writeText(qrResultUrl);
        setCopied(true);
        toastCustom("QR Code image URL copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!qrResultUrl) return;
        downloadFromUrl(qrResultUrl, `qrcode_${Date.now()}.png`);
        toastCustom("Downloading QR Code...");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Form & Configuration */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <form
                    onSubmit={handleGenerate}
                    className="
                        rounded-3xl border border-slate-800 bg-[#0B1220]/80
                        backdrop-blur-xl p-6 sm:p-7 shadow-xl
                    "
                >
                    <div className="flex items-center gap-2 mb-4">
                        <LinkIcon size={18} className="text-cyan-400" />
                        <h2 className="text-lg font-bold text-white">QR Code Parameters</h2>
                    </div>

                    {/* URL Input */}
                    <div className="flex flex-col gap-2 mb-5">
                        <label className="text-xs font-semibold text-slate-300">
                            Destination URL or Text <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://yourwebsite.com or text payload..."
                                className="
                                    w-full rounded-xl bg-slate-900/90 border border-slate-700
                                    px-4 py-3 text-sm text-white placeholder:text-slate-500
                                    focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50
                                    transition-all
                                "
                            />
                            {url && (
                                <button
                                    type="button"
                                    onClick={() => setUrl("")}
                                    className="absolute right-3 text-xs text-slate-400 hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        <span className="text-[11px] text-slate-500">
                            Supports full web URLs, Wi-Fi strings, contact cards, or plain text.
                        </span>
                    </div>

                    {/* Size Selector */}
                    <div className="flex flex-col gap-2 mb-6">
                        <label className="text-xs font-semibold text-slate-300">
                            Resolution / Dimensions
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {SIZE_PRESETS.map((preset) => (
                                <button
                                    type="button"
                                    key={preset.value}
                                    onClick={() => setSize(preset.value)}
                                    className={`
                                        py-2 px-3 rounded-xl text-xs font-medium border transition-all text-center
                                        ${size === preset.value
                                            ? "bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-sm shadow-cyan-500/20"
                                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                                        }
                                    `}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !url.trim()}
                        className={`
                            w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white
                            flex items-center justify-center gap-2 transition-all duration-200
                            ${loading || !url.trim()
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer"
                            }
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-white" />
                                <span>Generating QR Code...</span>
                            </>
                        ) : (
                            <>
                                <QrCode size={18} />
                                <span>Generate QR Code</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Recent History Panel */}
                {history.length > 0 && (
                    <div className="rounded-3xl border border-slate-800/80 bg-[#0B1220]/60 p-5 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-400">
                            <span className="flex items-center gap-1.5 text-white">
                                <History size={14} className="text-cyan-400" />
                                Recent Generated QR Codes
                            </span>
                            <button
                                onClick={() => {
                                    setHistory([]);
                                    localStorage.removeItem("devtoolbox_recent_qrs");
                                }}
                                className="text-[11px] text-slate-500 hover:text-slate-300"
                            >
                                Clear History
                            </button>
                        </div>

                        <div className="space-y-2">
                            {history.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setUrl(item.url);
                                        setQrResultUrl(item.qrUrl);
                                        setSize(item.size || 300);
                                    }}
                                    className="
                                        flex items-center justify-between p-2.5 rounded-xl
                                        border border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/70
                                        hover:border-cyan-500/30 transition-all cursor-pointer text-xs
                                    "
                                >
                                    <div className="min-w-0 pr-2">
                                        <p className="text-slate-200 font-medium truncate">{item.url}</p>
                                        <span className="text-[10px] text-slate-500">{item.date} • {item.size}x{item.size}</span>
                                    </div>
                                    <span className="shrink-0 text-cyan-400 text-xs font-semibold">Load</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Preview & Output */}
            <div className="lg:col-span-5">
                <div
                    className="
                        rounded-3xl border border-slate-800 bg-[#0B1220]/80
                        backdrop-blur-xl p-6 sm:p-7 shadow-xl flex flex-col items-center
                    "
                >
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Sparkles size={16} className="text-cyan-400" />
                            Live QR Preview
                        </h2>
                        {qrResultUrl && (
                            <span className="text-[11px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                Ready
                            </span>
                        )}
                    </div>

                    {/* QR Code Canvas / Image Display */}
                    <div
                        className="
                            w-full aspect-square max-w-[320px] rounded-2xl
                            border border-slate-700/80 bg-slate-950/80
                            p-4 flex flex-col items-center justify-center
                            shadow-inner relative overflow-hidden group
                        "
                    >
                        {loading ? (
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 size={36} className="animate-spin text-cyan-400" />
                                <span className="text-xs text-slate-400">Rendering high-res QR code...</span>
                            </div>
                        ) : qrResultUrl ? (
                            <div className="w-full h-full flex items-center justify-center bg-white rounded-xl p-3 shadow-md">
                                <img
                                    src={qrResultUrl}
                                    alt="Generated QR Code"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="text-center p-6 text-slate-500 flex flex-col items-center gap-3">
                                <QrCode size={48} strokeWidth={1.2} className="text-slate-600" />
                                <p className="text-xs">
                                    Enter a destination URL and click "Generate QR Code" to display your code.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions when QR Code is available */}
                    {qrResultUrl && (
                        <div className="w-full mt-6 flex flex-col gap-2.5">
                            <button
                                onClick={handleDownload}
                                className="
                                    w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white
                                    bg-cyan-500 hover:bg-cyan-400 active:scale-[0.99]
                                    flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20
                                "
                            >
                                <Download size={15} />
                                <span>Download PNG Image</span>
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={handleCopyLink}
                                    className="
                                        py-2 px-3 rounded-xl font-medium text-xs text-slate-300
                                        bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white
                                        flex items-center justify-center gap-1.5 transition-all
                                    "
                                >
                                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                    <span>{copied ? "Copied" : "Copy Link"}</span>
                                </button>

                                <a
                                    href={qrResultUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        py-2 px-3 rounded-xl font-medium text-xs text-slate-300
                                        bg-slate-900 border border-slate-700 hover:bg-slate-800 hover:text-white
                                        flex items-center justify-center gap-1.5 transition-all
                                    "
                                >
                                    <ExternalLink size={14} />
                                    <span>Open Tab</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QrCodeTool;
