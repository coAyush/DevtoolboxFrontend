import React from "react";
const ToolComponent = ({ icon: Icon, title, desc }) => {
    return (
        <div
            className="
                group w-full max-w-sm
                rounded-2xl p-[1px]
                bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500
                shadow-[0_0_20px_rgba(139,92,246,0.12)]
                hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]
                hover:-translate-y-1
                transition-all duration-300 ease-in-out
            "
        >
            <div
                className="
                    h-full rounded-2xl
                    bg-slate-950/95 backdrop-blur-xl
                    p-6 flex flex-col gap-4
                "
            >
                {/* Icon */}
                <div
                    className="
                        flex items-center justify-center
                        w-14 h-14 rounded-xl
                        bg-gradient-to-br from-cyan-500/15 to-purple-500/15
                        border border-purple-400/20
                        text-cyan-400
                        group-hover:text-purple-400
                        group-hover:scale-110
                        transition-all duration-300
                    "
                >
                    {Icon && <Icon size={28} strokeWidth={1.8} />}
                </div>

                {/* Title */}
                <h2
                    className="
                        text-xl font-bold
                        text-transparent bg-clip-text
                        bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400
                    "
                >
                    {title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-6 text-slate-400">
                    {desc}
                </p>

                {/* Bottom label */}
                <div
                    className="
                        mt-auto pt-3
                        border-t border-slate-800
                        flex items-center justify-between
                    "
                >
                    <span className="text-xs font-medium text-slate-500">
                        Explore tools
                    </span>

                    <span
                        className="
                            text-cyan-400 text-lg
                            group-hover:translate-x-1
                            transition-transform duration-300
                        "
                    >
                        →
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ToolComponent;