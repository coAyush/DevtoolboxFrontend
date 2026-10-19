import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    Terminal,
    Cpu,
    Zap,
    ShieldCheck,
    Send,
    Mail,
    MapPin,
    Globe
} from 'lucide-react';
import { toastError, toastLoading, toastSuccess } from '../../util/toat';
import { sendMailEnquiry } from '../../services/landing/MailSubmit';

export default function AboutUs() {
    const [enquiry, setEnquiry] = useState({
        subject: "Contact Us",
        name: "",
        email: "",
        inquiryTopic: "",
        message: ""
    })

    const handleSubmit = async () => {
        try {
            toastLoading("submitting your query...")

            const { code, message, status, data } = await sendMailEnquiry({ enquiry });
            if (code == 0) {
                toastSuccess(message)
            } else {
                toastError(message)
            }
        } catch (error) {
            console.error(error)
            toastError(error.message)
        }
    }
    return (
        <div className="min-h-screen bg-[#07090e] text-slate-200 selection:bg-cyan-500 selection:text-white relative overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
            <div className="absolute top-[600px] -right-20 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

            <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 space-y-24">
                <section className="text-center max-w-3xl mx-auto space-y-5">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold tracking-wider text-violet-300 uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Built for Creators & Engineers
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Unifying Browser Utilities and{' '}
                        <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                            Production-Grade APIs
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                        DevToolBox is an industry-grade, Dual-Track SaaS ecosystem engineered to bridge everyday web productivity tools with scalable, sub-millisecond REST microservices for modern software builders.
                    </p>
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Browser Utility Track</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Instant, zero-friction client tools designed for creators and teams. Perform quick file conversions, QR styling, and URL routing without terminal setup.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-cyan-300/90">
                            <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40">Vector QR Studio</span>
                            <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40">Ghostscript PDF Engines</span>
                            <span className="px-2.5 py-1 rounded-md bg-cyan-950/60 border border-cyan-800/40">Vanity Short Links</span>
                        </div>
                    </div>
                    <div className="group relative rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 transition-all hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                        <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Developer Infrastructure Track</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Stateless microservices powered by Spring Boot 3.4 and Redis. Direct API key access with token-bucket rate limiting and live telemetry analytics.
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs font-medium text-violet-300/90">
                            <span className="px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-800/40">X-API-KEY Auth</span>
                            <span className="px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-800/40">Redis Rate Limiting</span>
                            <span className="px-2.5 py-1 rounded-md bg-violet-950/60 border border-violet-800/40">&lt;50ms Response Latency</span>
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Architecture Foundation</h2>
                        <p className="text-slate-400 text-sm mt-1">Built strictly on modern production-grade standards</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <h4 className="font-semibold text-white text-sm">Spring Boot 3.4 & Security 6</h4>
                            <p className="text-xs text-slate-400">Stateless JWT session handling and isolated API key filtering chains.</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-2">
                            <Zap className="w-5 h-5 text-amber-400" />
                            <h4 className="font-semibold text-white text-sm">Distributed Redis Caching</h4>
                            <p className="text-xs text-slate-400">Token-bucket rate limiting and sub-2ms cache redirect lookups.</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-2">
                            <Cpu className="w-5 h-5 text-cyan-400" />
                            <h4 className="font-semibold text-white text-sm">React 19 & Tailwind v4</h4>
                            <p className="text-xs text-slate-400">Modern component composition with zero-runtime utility styles.</p>
                        </div>
                        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 space-y-2">
                            <Terminal className="w-5 h-5 text-violet-400" />
                            <h4 className="font-semibold text-white text-sm">Spring AI Diagnostics</h4>
                            <p className="text-xs text-slate-400">Autonomous incident root-cause triage and telemetry analysis.</p>
                        </div>
                    </div>
                </section>

                {/* Contact & Support Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6 border-t border-white/10">
                    {/* Contact Details */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Get in Touch</h2>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                Need customized API limits, enterprise self-hosting support, or integration guidance? Our engineering team is active and ready to assist.
                            </p>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase">API & Support Inquiries</div>
                                    <a href="mailto:support@devtoolbox.io" className="hover:text-white transition">support@devtoolbox.io</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-violet-400">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase">Live Telemetry & Status</div>
                                    <span className="text-slate-200">status.devtoolbox.io (99.99% Uptime)</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-emerald-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium uppercase">Development Center</div>
                                    <span className="text-slate-200">Kolkata, West Bengal, India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Contact Card */}
                    <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8">
                        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Alex Morgan"
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                                        value={enquiry.name}
                                        onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="alex@company.com"
                                        className="w-full bg-[#0b0f19] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                                        value={enquiry.email}
                                        onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Inquiry Topic</label>
                                <select className="w-full bg-[#0b0f19] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                                    value={enquiry.inquiryTopic}
                                    onChange={(e) => setEnquiry({ ...enquiry, inquiryTopic: e.target.value })}
                                >
                                    <option value="API Quota & Custom Limits">API Quota & Custom Limits</option>
                                    <option value="Bug Report / Technical Triage">Bug Report / Technical Triage</option>
                                    <option value="General Feedback">General Feedback</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Share details regarding your application or technical query..."
                                    className="w-full bg-[#0b0f19] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                                    value={enquiry.message}
                                    onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-medium text-sm hover:opacity-95 transition shadow-lg shadow-indigo-500/20 cursor-pointer"
                                onClick={() => handleSubmit()}
                            >
                                <Send className="w-4 h-4" />
                                Submit Inquiry
                            </button>
                        </form>
                    </div>
                </section>

            </main>
        </div>
    );
}