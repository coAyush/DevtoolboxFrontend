import React, { useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import { toastError } from '../../util/toat';
import { Image, Zap, FileText } from "lucide-react";
import ToolComponent from '../../components/landing/ToolComponent';
import PageBackground from '../../styles/Pagebackground';

const Tools = () => {
    const categoryIcons = {
        "Image Tools": Image,
        "Productivity Tools": Zap,
        "PDF Tools": FileText,
    };
    const [tools, setTools] = useState([]);

    const { code, message, status, data } = useLoaderData() || {};

    useEffect(() => {
        if (code === 0) {
            setTools(data ?? []);
        } else if (message) {
            toastError(message);
        }
    }, [code, message, data]);

    const filteredTools = tools.filter((tool) => (tool.category || "user").toLowerCase() === "user");

    return (
        <PageBackground>
            <div className="min-h-[calc(100vh-8rem)] w-full max-w-6xl flex flex-col items-center px-4 py-8 sm:py-12">
                {/* Header */}
                <div className="text-center max-w-2xl mb-8 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
                        Tool Directory
                    </span>
                    <h1 className="font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight pt-1">
                        Browser-first productivity utilities
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                        Handcrafted tools designed to speed up your everyday tasks. Clean, client-first, and zero clutter.
                    </p>
                </div>

                {/* Grid */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-4 mb-8">
                    {filteredTools.map((tool) => {
                        const Icon = categoryIcons[tool.tools_category] ?? FileText;
                        const descriptions = {
                            "Image Tools": "Compress and convert images without losing quality.",
                            "Productivity Tools": "Generate QR codes, UUIDs, and count words instantly.",
                            "PDF Tools": "Merge, split, and compress PDF documents securely in your browser.",
                        };

                        return (
                            <ToolComponent
                                key={tool.id}
                                icon={Icon}
                                title={tool.tools_category}
                                desc={descriptions[tool.tools_category] ?? "Explore useful tools for your workflow."}
                            />
                        );
                    })}
                </div>
            </div>
        </PageBackground>
    );
};

export default Tools;
