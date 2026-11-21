import React, { useState, useMemo, useEffect, useRef } from "react";
import {
    AlignLeft,
    Type,
    Copy,
    Check,
    RotateCcw,
    Clock,
    Mic,
    BookOpen,
    FileText,
    Sparkles,
    Hash,
    Layers,
    Scissors
} from "lucide-react";
import { logToolUsageApi } from "../../../../services/user/UserToolsService";
import { toastCustom } from "../../../../util/toat";

const SAMPLE_TEXT = `Welcome to DevToolBox! This versatile productivity suite accelerates development and document workflows with powerful utilities. From generating high-resolution QR codes to compressing PDFs and shortening links, DevToolBox simplifies your daily tasks into effortless operations. Explore the various tools and elevate your engineering productivity!`;

/**
 * Word Counter & Text Analysis Tool.
 * Logs tool usage to: POST /api/users/tools/log-usage?toolId=2&subToolId=3
 */
const WordCounterTool = ({ tool }) => {
    const [text, setText] = useState("");
    const [copied, setCopied] = useState(false);
    const hasLoggedRef = useRef(false);

    const toolId = tool?.toolId || 2;
    const subToolId = tool?.subToolId || 3;

    // Log tool usage once when the user begins typing/interacting
    const logUsageOnce = () => {
        if (!hasLoggedRef.current) {
            hasLoggedRef.current = true;
            logToolUsageApi({ toolId, subToolId });
        }
    };

    // Calculate text analytics
    const stats = useMemo(() => {
        const raw = text.trim();
        if (!raw) {
            return {
                words: 0,
                charsWithSpaces: 0,
                charsNoSpaces: 0,
                sentences: 0,
                paragraphs: 0,
                readingTime: 0,
                speakingTime: 0,
            };
        }

        // Word count (split by whitespace)
        const wordList = raw.split(/\s+/).filter(Boolean);
        const words = wordList.length;

        // Character counts
        const charsWithSpaces = text.length;
        const charsNoSpaces = text.replace(/\s/g, "").length;

        // Sentences (split by punctuation . ! ?)
        const sentences = raw.split(/[.!?]+/).filter((s) => s.trim().length > 0).length || 1;

        // Paragraphs (split by double newlines or single newlines)
        const paragraphs = raw.split(/\n+/).filter((p) => p.trim().length > 0).length || 1;

        // Average reading speed: 200 WPM; speaking speed: 130 WPM
        const readingTime = Math.ceil(words / 200);
        const speakingTime = Math.ceil(words / 130);

        return {
            words,
            charsWithSpaces,
            charsNoSpaces,
            sentences,
            paragraphs,
            readingTime,
            speakingTime,
        };
    }, [text]);

    // Top keyword frequency analysis (excluding trivial words)
    const topKeywords = useMemo(() => {
        if (!text.trim()) return [];
        const stopWords = new Set([
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
            "with", "is", "was", "are", "were", "it", "this", "that", "from", "as", "by"
        ]);

        const words = text
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((w) => w.length > 2 && !stopWords.has(w));

        const freqMap = {};
        words.forEach((w) => {
            freqMap[w] = (freqMap[w] || 0) + 1;
        });

        return Object.entries(freqMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word, count]) => ({
                word,
                count,
                percentage: ((count / (words.length || 1)) * 100).toFixed(0),
            }));
    }, [text]);

    // Handle text change
    const handleTextChange = (e) => {
        setText(e.target.value);
        if (e.target.value.trim().length > 5) {
            logUsageOnce();
        }
    };

    // Text transformations
    const transformCase = (type) => {
        if (!text) return;
        logUsageOnce();
        let transformed = text;
        if (type === "uppercase") {
            transformed = text.toUpperCase();
        } else if (type === "lowercase") {
            transformed = text.toLowerCase();
        } else if (type === "title") {
            transformed = text.replace(
                /\w\S*/g,
                (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase()
            );
        } else if (type === "sentence") {
            transformed = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        }
        setText(transformed);
        toastCustom(`Converted text to ${type} case`);
    };

    const handleCopy = () => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        toastCustom("Text copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoadSample = () => {
        setText(SAMPLE_TEXT);
        logUsageOnce();
        toastCustom("Loaded sample text");
    };

    const handleClear = () => {
        setText("");
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8 w-full max-w-6xl mx-auto">
            {/* Top Stat Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Total Words</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1">
                            {stats.words}
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
                        <Type size={22} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Characters</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                            {stats.charsWithSpaces}
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                        <Hash size={22} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Sentences</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1">
                            {stats.sentences}
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                        <FileText size={22} />
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Paragraphs</p>
                        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                            {stats.paragraphs}
                        </p>
                    </div>
                    <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                        <Layers size={22} />
                    </div>
                </div>
            </div>

            {/* Main Editor Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                        {/* Editor Header Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                                <AlignLeft size={16} className="text-cyan-400" />
                                Type or Paste Text Below
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLoadSample}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition"
                                >
                                    Sample Text
                                </button>
                                {text && (
                                    <>
                                        <button
                                            onClick={handleCopy}
                                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center gap-1"
                                        >
                                            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            <span>{copied ? "Copied" : "Copy"}</span>
                                        </button>
                                        <button
                                            onClick={handleClear}
                                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 transition"
                                        >
                                            Clear
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={text}
                            onChange={handleTextChange}
                            placeholder="Start typing your article, essay, or code description here..."
                            rows={12}
                            className="
                                w-full rounded-2xl bg-slate-900/90 border border-slate-700/80
                                p-4 text-sm sm:text-base text-white placeholder:text-slate-500
                                focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50
                                resize-y transition-all leading-relaxed font-sans
                            "
                        />

                        {/* Quick Text Case Transformers */}
                        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-slate-400">
                                Case Modifiers:
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => transformCase("uppercase")}
                                    disabled={!text}
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                                >
                                    UPPERCASE
                                </button>
                                <button
                                    onClick={() => transformCase("lowercase")}
                                    disabled={!text}
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                                >
                                    lowercase
                                </button>
                                <button
                                    onClick={() => transformCase("title")}
                                    disabled={!text}
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                                >
                                    Title Case
                                </button>
                                <button
                                    onClick={() => transformCase("sentence")}
                                    disabled={!text}
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition"
                                >
                                    Sentence case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Analytics Sidebar */}
                <div className="lg:col-span-4 flex flex-col gap-5">
                    {/* Reading Estimates */}
                    <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-cyan-400" />
                            Time Estimates
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <BookOpen size={16} className="text-cyan-400" />
                                    <span className="text-xs text-slate-300">Reading Time</span>
                                </div>
                                <span className="text-xs font-bold text-white">
                                    ~{stats.readingTime} {stats.readingTime === 1 ? "min" : "mins"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <Mic size={16} className="text-purple-400" />
                                    <span className="text-xs text-slate-300">Speaking Time</span>
                                </div>
                                <span className="text-xs font-bold text-white">
                                    ~{stats.speakingTime} {stats.speakingTime === 1 ? "min" : "mins"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                            Based on standard speeds: 200 WPM reading & 130 WPM speaking.
                        </div>
                    </div>

                    {/* Keyword Density */}
                    <div className="rounded-3xl border border-slate-800 bg-[#0B1220]/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={16} className="text-cyan-400" />
                            Top Keyword Frequency
                        </h3>

                        {topKeywords.length > 0 ? (
                            <div className="space-y-2.5">
                                {topKeywords.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/50 border border-slate-800/80"
                                    >
                                        <span className="font-semibold text-slate-200 capitalize">
                                            {item.word}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400 font-mono">{item.count}x</span>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-500 text-center py-4">
                                Enter text with more than a few words to see keyword frequency.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WordCounterTool;
