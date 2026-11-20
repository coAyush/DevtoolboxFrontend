import React, { useState, useEffect, useMemo } from "react";
import {
    Link2,
    Sparkles,
    Copy,
    Check,
    ExternalLink,
    Loader2,
    RefreshCw,
    BarChart3,
    MousePointerClick,
    Calendar,
    Clock,
    Search,
    AlertCircle,
    Globe,
    Tag,
    ArrowUpRight,
    QrCode
} from "lucide-react";
import { shortenUrlApi, getUrlAnalyticsApi } from "../../../../services/user/UserToolsService";
import { toastCustom, toastError } from "../../../../util/toat";

/**
 * Format ISO date string into human-friendly format
 */
const formatDate = (dateString) => {
    if (!dateString) return "Never";
    try {
        const d = new Date(dateString);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return dateString;
    }
};

/**
 * Check if a link has expired
 */
const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt).getTime() < Date.now();
};

/**
 * URL Shortener Controller & Analytics Dashboard.
 * Connects to:
 * - POST /api/users/tools/shorten-url (Creates shortened link)
 * - POST /api/users/tools/url (Fetches click analytics & user link list)
 */
const UrlShortenerTool = ({ tool }) => {
    const [longUrl, setLongUrl] = useState("");
    const [alias, setAlias] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedUrl, setGeneratedUrl] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Analytics state
    const [analytics, setAnalytics] = useState([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");

    const toolId = tool?.toolId || 2;
    const subToolId = tool?.subToolId || 4;

    /**
     * Fetch URL analytics list from POST /api/users/tools/url
     */
    const fetchAnalytics = async () => {
        setLoadingAnalytics(true);
        try {
            const response = await getUrlAnalyticsApi({ toolId, subToolId });
            const list = response?.data || response?.details || [];
            if (Array.isArray(list)) {
                setAnalytics(list);
            }
        } catch (err) {
            console.error("Failed to load analytics:", err);
            // If backend is not reached, preserve existing
        } finally {
            setLoadingAnalytics(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    /**
     * Handle shortening a new URL
     */
    const handleShorten = async (e) => {
        if (e) e.preventDefault();
        const trimmed = longUrl.trim();
        if (!trimmed) {
            toastError("Please enter a destination URL to shorten");
            return;
        }

        // Basic URL pattern verification
        if (!/^https?:\/\//i.test(trimmed)) {
            toastError("Please include http:// or https:// in the URL");
            return;
        }

        setLoading(true);
        try {
            const response = await shortenUrlApi({
                longUrl: trimmed,
                alias: alias.trim() || undefined,
                toolId,
                subToolId,
            });

            // Extract shortened URL from response: { details: "http://localhost:8080/..." }
            const shortResult = response?.data || response?.details || response;
            if (shortResult) {
                setGeneratedUrl(shortResult);
                toastCustom("URL shortened successfully!");
                setLongUrl("");
                setAlias("");
                // Refresh analytics list
                fetchAnalytics();
            } else {
                toastError("Unexpected server response format");
            }
        } catch (err) {
            console.error("Shorten URL error:", err);
            toastError(err?.message || "Failed to shorten URL");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, id = "main") => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toastCustom("Short URL copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filter analytics by search term
    const filteredAnalytics = useMemo(() => {
        if (!searchFilter.trim()) return analytics;
        const term = searchFilter.toLowerCase();
        return analytics.filter(
            (item) =>
                (item.shortUrl || "").toLowerCase().includes(term) ||
                (item.originalUrl || "").toLowerCase().includes(term)
        );
    }, [analytics, searchFilter]);

    // Computed totals
    const totalClicks = useMemo(() => {
        return analytics.reduce((acc, curr) => acc + (curr.clickCount || 0), 0);
    }, [analytics]);

    const activeLinksCount = useMemo(() => {
        return analytics.filter((item) => !isExpired(item.expiresAt)).length;
    }, [analytics]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Short Links</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {analytics.length}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                        <Link2 size={24} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Link Clicks</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {totalClicks}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                        <MousePointerClick size={24} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Active Links</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                            {activeLinksCount}
                        </p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <BarChart3 size={24} />
                    </div>
                </div>
            </div>

            {/* Shortener Creation Form */}
            <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-5">
                    <Sparkles size={20} className="text-cyan-400" />
                    <h2 className="text-lg sm:text-xl font-bold text-white">Create Short Link</h2>
                </div>

                <form onSubmit={handleShorten} className="flex flex-col gap-5">
                    {/* Long URL Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                            <Globe size={14} className="text-cyan-400" />
                            Target Destination URL <span className="text-rose-400">*</span>
                        </label>
                        <div className="relative flex items-center">
                            <input
                                type="url"
                                value={longUrl}
                                onChange={(e) => setLongUrl(e.target.value)}
                                placeholder="https://example.com/very/long/path/or/article?query=..."
                                required
                                className="
                                    w-full rounded-xl bg-slate-900/90 border border-slate-700
                                    px-4 py-3 text-sm text-white placeholder:text-slate-500
                                    focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50
                                    transition-all
                                "
                            />
                            {longUrl && (
                                <button
                                    type="button"
                                    onClick={() => setLongUrl("")}
                                    className="absolute right-3 text-xs text-slate-400 hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Alias Input */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                                <Tag size={14} className="text-purple-400" />
                                Custom Alias <span className="text-slate-500 font-normal">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                value={alias}
                                onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                                placeholder="e.g. spring-boot, launch-promo"
                                className="
                                    w-full rounded-xl bg-slate-900/90 border border-slate-700
                                    px-4 py-3 text-sm text-white placeholder:text-slate-500
                                    focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50
                                    transition-all
                                "
                            />
                        </div>

                        <div className="flex flex-col justify-end">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-400">
                                <p className="font-medium text-slate-300 mb-0.5">Link Preview:</p>
                                <span className="text-cyan-400 font-mono">
                                    http://localhost:8080/{alias ? alias : "[auto-code]"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading || !longUrl.trim()}
                        className={`
                            mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white
                            flex items-center justify-center gap-2 transition-all duration-200
                            ${loading || !longUrl.trim()
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                                : "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-lg shadow-cyan-500/25 active:scale-[0.99] cursor-pointer"
                            }
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin text-white" />
                                <span>Generating Short Link...</span>
                            </>
                        ) : (
                            <>
                                <Link2 size={18} />
                                <span>Shorten URL</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Newly Generated URL Banner */}
                {generatedUrl && (
                    <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in duration-300">
                        <div className="min-w-0">
                            <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                                New Short Link Generated
                            </span>
                            <p className="text-base sm:text-lg font-mono font-bold text-white truncate mt-0.5">
                                {generatedUrl}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => handleCopy(generatedUrl, "banner")}
                                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-white flex items-center gap-1.5 shadow-md transition"
                            >
                                {copiedId === "banner" ? <Check size={14} /> : <Copy size={14} />}
                                <span>{copiedId === "banner" ? "Copied" : "Copy"}</span>
                            </button>

                            <a
                                href={generatedUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
                            >
                                <ExternalLink size={14} />
                                <span>Test Link</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Analytics Dashboard Table */}
            <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 size={20} className="text-purple-400" />
                            URL Analytics & History
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Live click tracking and active link records.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex items-center">
                            <Search size={15} className="text-slate-400 absolute left-3" />
                            <input
                                type="text"
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                placeholder="Search links..."
                                className="
                                    pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700
                                    text-xs text-white placeholder:text-slate-500 outline-none
                                    focus:border-cyan-500 transition-all w-44 sm:w-56
                                "
                            />
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={fetchAnalytics}
                            disabled={loadingAnalytics}
                            className="p-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition disabled:opacity-50"
                            title="Refresh analytics data"
                        >
                            <RefreshCw size={16} className={loadingAnalytics ? "animate-spin text-cyan-400" : ""} />
                        </button>
                    </div>
                </div>

                {loadingAnalytics && analytics.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3">
                        <Loader2 size={32} className="animate-spin text-cyan-400" />
                        <p className="text-xs text-slate-400">Loading URL analytics from server...</p>
                    </div>
                ) : filteredAnalytics.length > 0 ? (
                    <div className="space-y-3">
                        {filteredAnalytics.map((item) => {
                            const expired = isExpired(item.expiresAt);
                            return (
                                <div
                                    key={item.id}
                                    className="
                                        p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/50
                                        hover:border-slate-700 hover:bg-slate-900/80 transition-all
                                        flex flex-col lg:flex-row lg:items-center justify-between gap-4
                                    "
                                >
                                    {/* Left: URLs info */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="font-mono text-sm sm:text-base font-bold text-cyan-400 truncate">
                                                {item.shortUrl}
                                            </span>
                                            {expired ? (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                                    Expired
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Active
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-slate-400 truncate max-w-2xl leading-relaxed" title={item.originalUrl}>
                                            <span className="text-slate-500 font-medium">Destination: </span>
                                            {item.originalUrl}
                                        </p>

                                        {/* Metadata dates */}
                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} className="text-slate-400" />
                                                Created: {formatDate(item.createdAt)}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} className="text-slate-400" />
                                                Last Clicked: {formatDate(item.lastClickedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Metrics & Actions */}
                                    <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                                        {/* Click counter badge */}
                                        <div className="text-right">
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs sm:text-sm">
                                                <MousePointerClick size={15} />
                                                <span>{item.clickCount} {item.clickCount === 1 ? "Click" : "Clicks"}</span>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleCopy(item.shortUrl, item.id)}
                                                className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
                                                title="Copy short link"
                                            >
                                                {copiedId === item.id ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                                            </button>

                                            <a
                                                href={item.shortUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition"
                                                title="Open short link"
                                            >
                                                <ArrowUpRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-400">
                        <Link2 size={32} className="mx-auto mb-3 text-slate-600" />
                        <p className="text-sm font-semibold text-white">No shortened links found</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {searchFilter ? "Try another search keyword." : "Shorten your first link above to start tracking clicks!"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UrlShortenerTool;
