import { Link, useNavigate } from "react-router";
import {
    ArrowLeft,
    ArrowRight,
    Home,
    Search,
    Compass,
    Terminal,
    Code2,
    House
} from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090b10] px-5 py-12 text-slate-100">
            {/* Background decoration */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />

            <section className="relative z-10 mx-auto w-full max-w-3xl text-center">
                {/* Brand */}
                <Link
                    to="/"
                    className="mb-12 inline-flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2.5 transition hover:border-blue-500/40"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                        <Terminal size={20} />
                    </div>

                    <span className="text-lg font-bold tracking-tight">
                        DevTool<span className="text-blue-400">Box</span>
                    </span>
                </Link>

                {/* Error illustration */}
                <div className="relative mx-auto mb-8 w-fit">
                    <div className="font-mono text-[120px] font-black leading-none tracking-tighter text-transparent bg-gradient-to-b from-blue-300 via-blue-500 to-indigo-700 bg-clip-text sm:text-[180px]">
                        404
                    </div>

                    <div className="absolute -right-2 top-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-slate-900 text-blue-400 shadow-xl sm:-right-5 sm:top-5">
                        <Search size={24} />
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5 font-mono text-xs text-amber-300">
                        <Compass size={14} />
                        ROUTE_NOT_FOUND
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                        Looks like you've lost your way.
                    </h1>

                    <p className="mx-auto max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                        The page you're looking for doesn't exist, may have
                        moved, or the URL might be incorrect. Let's get you
                        back to your workspace.
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium transition hover:border-slate-500 hover:bg-slate-800"
                    >
                        <ArrowLeft size={17} />
                        Go Back
                    </button>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-500"
                    >
                        <Home size={17} />
                        Back to Home
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Helpful links */}
                <div className="mt-14 border-t border-slate-800/80 pt-6">
                    <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                        Or explore DevToolBox
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/pricing"
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-blue-300"
                        >
                            <Code2 size={16} />
                            Pricing
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-900 hover:text-blue-300"
                        >
                            <House size={16} />
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-12 font-mono text-xs text-slate-600">
                    ERROR_CODE: 404 · RESOURCE_NOT_FOUND
                </p>
            </section>
        </main>
    );
}