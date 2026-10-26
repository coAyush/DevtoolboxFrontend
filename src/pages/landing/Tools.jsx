import React, { useEffect, useState } from 'react'
import { FaToggleOff, FaToggleOn } from 'react-icons/fa6';
import { useLoaderData } from 'react-router';
import { toastError } from '../../util/toat';
import { Image, Zap, FileText } from "lucide-react";
import ToolComponent from '../../components/landing/ToolComponent';


const Tools = () => {
    const categoryIcons = {
        "Image Tools": Image,
        "Productivity Tools": Zap,
        "PDF Tools": FileText,
    };
    const [role, setRole] = useState("user");
    const [tools, setTools] = useState([]);
    const handleRole = () => {
        setRole((prev) => (prev === "user" ? "developer" : "user"));
    };
    console.log(tools);

    const { code, message, status, data } = useLoaderData();
    useEffect(() => {
        if (code === 0) {
            setTools(data ?? []);
        } else {
            toastError(message);
        }
    }, [code, message, data]);
    const filteredTools = tools.filter((tool) => tool.category.toLowerCase() === role);
    console.log(filteredTools);
    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center px-4 pt-4">
            <div className="text-center mb-3">
                <h1
                    className="
                                font-bold
                                text-4xl
                                sm:text-5xl
                                md:text-6xl
                                text-transparent
                                bg-clip-text
                                bg-gradient-to-r
                                from-cyan-400
                                via-purple-500
                                to-pink-500
                            "
                >
                    Reliable tools for every developer
                </h1>

                <p className="mt-3 text-sm md:text-base text-slate-400">
                    Tools for makking your work easy
                </p>
            </div>


            {/* 
             * RESPONSIVE TOGGLE BAR TIP:
             * Using `min-h-12 h-auto` and `text-xs sm:text-sm` prevents button label wrapping
             * from breaking the container height on mobile.
             */}
            <div
                className="
                    relative
                    w-full
                    max-w-md sm:max-w-lg
                    min-h-12 h-auto
                    rounded-xl
                    p-[1px]
                    bg-gradient-to-r
                    from-cyan-500
                    via-purple-500
                    to-pink-500
                    shadow-[0_0_25px_rgba(139,92,246,0.12)]
                "
            >
                <div
                    className="
                        relative
                        w-full
                        h-full
                        min-h-[46px]
                        rounded-xl
                        bg-slate-950/95
                        backdrop-blur-xl
                        flex
                        items-center
                        justify-between
                        px-2.5 sm:px-4
                        py-1
                        gap-1 sm:gap-2
                    "
                >

                    {/* Normal User */}
                    <button
                        type="button"
                        onClick={() => setRole("user")}
                        className={`
                            flex-1
                            text-xs sm:text-sm
                            font-medium
                            transition-all
                            duration-300
                            focus-visible:outline-none
                            ${role === "user"
                                ? "text-cyan-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }
                        `}
                    >
                        Normal User tools
                    </button>
                    <button
                        type="button"
                        onClick={handleRole}
                        aria-label="Switch tool categories"
                        className="
                            shrink-0
                            flex
                            items-center
                            justify-center
                            text-purple-400
                            hover:text-cyan-400
                            transition-all
                            duration-300
                            hover:scale-110
                            active:scale-95
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-purple-400/40
                            rounded-md
                            p-1
                        "
                    >
                        {role === "user" ? (
                            <FaToggleOff size={28} className="sm:w-8 sm:h-8" />
                        ) : (
                            <FaToggleOn size={28} className="sm:w-8 sm:h-8" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("developer")}
                        className={`
                            flex-1
                            text-xs sm:text-sm
                            font-medium
                            transition-all
                            duration-300
                            focus-visible:outline-none
                            ${role === "developer"
                                ? "text-purple-400 font-semibold"
                                : "text-slate-500 hover:text-slate-300"
                            }
                        `}
                    >
                        Developer API tools
                    </button>

                </div>
            </div>
            <p className="mt-5 text-sm text-slate-500">
                Showing{" "}
                <span
                    className={
                        role === "user"
                            ? "text-cyan-400 font-medium"
                            : "text-purple-400 font-medium"
                    }
                >
                    {role === "user" ? "Normal User" : "Developer API"}
                </span>{" "}
                tools
            </p>
            <div className="
    mt-8 w-full max-w-6xl
    grid grid-cols-1
    sm:grid-cols-2
    lg:grid-cols-3
    gap-6
">
                {
                    filteredTools.map((tool) => {
                        const Icon =
                            categoryIcons[tool.tools_category] ?? FileText;

                        const descriptions = {
                            "Image Tools":
                                "Compress and convert images with ease.",
                            "Productivity Tools":
                                "Generate QR codes, UUIDs, and count words.",
                            "PDF Tools":
                                "Merge, split, and compress PDF documents.",
                        };

                        return (
                            <ToolComponent
                                key={tool.id}
                                icon={Icon}
                                title={tool.tools_category}
                                desc={
                                    descriptions[tool.tools_category] ??
                                    "Explore useful tools for your workflow."
                                }
                            />
                        );
                    })}
            </div>
        </div>
    )
}

export default Tools