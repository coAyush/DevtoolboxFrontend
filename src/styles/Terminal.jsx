const Terminal = ({ className = "", children, glass = false }) => {
    return (
        <div className={`${className} relative z-10 flex items-center justify-center`}>
            <div
                className={`
                    relative
                    h-full
                    w-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    shadow-2xl
                    shadow-black/50
                    ${glass
                        ? "bg-[#0b0f19]/80 backdrop-blur-xl"
                        : "bg-[#080c14]"
                    }
                `}
            >
                {/* Header */}
                <div className="
                    relative
                    z-20
                    h-11
                    flex
                    items-center
                    justify-between
                    px-4
                    bg-slate-900/70
                    border-b
                    border-white/10
                ">
                    <div className="flex gap-2 items-center">
                        <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                        <div className="w-3 h-3 rounded-full bg-[#eab308]" />
                        <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                    </div>

                    {/* Window Title / Pill Bar */}
                    <div className="w-48 sm:w-64 h-5 rounded-full bg-slate-950/60 border border-white/5 mx-auto absolute left-1/2 -translate-x-1/2" />

                    <div className="w-12" />
                </div>

                {/* Body */}
                <div className="
                    relative
                    h-[calc(100%-2.75rem)]
                    w-full
                    flex
                    justify-center
                    overflow-y-auto
                    custom-scrollbar
                    p-3 sm:p-5
                ">
                    {/* Background glows */}
                    <div className="
                        absolute
                        -top-10
                        left-10
                        w-48
                        h-48
                        rounded-full
                        bg-cyan-500/20
                        blur-[90px]
                        pointer-events-none
                        z-0
                    " />

                    <div className="
                        absolute
                        -bottom-10
                        right-10
                        w-48
                        h-48
                        rounded-full
                        bg-purple-500/20
                        blur-[90px]
                        pointer-events-none
                        z-0
                    " />

                    {/* Ambient IDE / Code backdrop from the reference image */}
                    <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none overflow-hidden font-mono text-[11px] leading-relaxed p-6 text-slate-400 blur-[0.5px]">
                        <div className="flex h-full">
                            {/* Faint sidebar */}
                            <div className="w-44 border-r border-white/10 pr-4 hidden md:flex flex-col gap-3">
                                <div className="h-4 w-28 bg-white/20 rounded mb-2"></div>
                                <div className="h-3 w-20 bg-white/10 rounded"></div>
                                <div className="h-3 w-16 bg-white/10 rounded"></div>
                                <div className="h-3 w-24 bg-white/10 rounded"></div>
                            </div>
                            {/* Faint code */}
                            <div className="flex-1 pl-8 space-y-1">
                                <div><span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-emerald-400">'react'</span>;</div>
                                <div><span className="text-purple-400">import</span> &#123; DevToolBox &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'@devtoolbox/core'</span>;</div>
                                <br />
                                <div><span className="text-blue-400">export const</span> <span className="text-yellow-300">workspaceConfig</span> = &#123;</div>
                                <div className="pl-4">version: <span className="text-emerald-400">'2.4.0'</span>,</div>
                                <div className="pl-4">environment: <span className="text-emerald-400">'production'</span>,</div>
                                <div className="pl-4">theme: <span className="text-emerald-400">'midnight-cyan'</span>,</div>
                                <div>&#125;;</div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 w-full flex items-center justify-center my-auto py-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Terminal;