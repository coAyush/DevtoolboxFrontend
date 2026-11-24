import React, { useState } from 'react';
import {
    Sparkles,
    ShieldCheck,
    Send,
    Mail,
    MapPin,
    Globe,
    Zap,
    Cpu,
    Lock
} from 'lucide-react';
import { toastError, toastLoading, toastSuccess } from '../../util/toat';
import { sendMailEnquiry } from '../../services/landing/MailSubmit';
import PageBackground from '../../styles/Pagebackground';

export default function AboutUs() {
    const [enquiry, setEnquiry] = useState({
        subject: "Contact Us",
        name: "",
        email: "",
        inquiryTopic: "General Feedback",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!enquiry.name.trim() || !enquiry.email.trim() || !enquiry.message.trim()) {
            toastError("Please fill in your name, email, and message.");
            return;
        }

        try {
            setIsSubmitting(true);
            toastLoading("Submitting your inquiry...");

            const { code, message } = await sendMailEnquiry({ enquiry });
            setIsSubmitting(false);

            if (code === 0) {
                toastSuccess(message || "Thank you for reaching out! We will get back to you shortly.");
                setEnquiry({
                    subject: "Contact Us",
                    name: "",
                    email: "",
                    inquiryTopic: "General Feedback",
                    message: ""
                });
            } else {
                toastError(message || "Failed to submit inquiry.");
            }
        } catch (error) {
            setIsSubmitting(false);
            console.error(error);
            toastError(error?.message || "Failed to send inquiry.");
        }
    };

    return (
        <PageBackground>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16">
                {/* Mission Section */}
                <section className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40">
                        About DevToolBox
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                        Built for creators and developers who value simplicity.
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed pt-1">
                        We got tired of bloated web converters covered in intrusive ads, sluggish loading times, and questionable privacy policies. DevToolBox was built to provide clean, fast, reliable utilities that respect your workflow.
                    </p>
                </section>

                {/* Core Principles */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Zap size={20} />
                        </div>
                        <h3 className="font-bold text-white text-base">Instant Performance</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Zero needless round-trips. Client-first processing enables near-instant file transformations and code generation.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Lock size={20} />
                        </div>
                        <h3 className="font-bold text-white text-base">Privacy by Design</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Your documents and sensitive text remain on your device whenever possible. We never sell your data or inject ads.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                            <Cpu size={20} />
                        </div>
                        <h3 className="font-bold text-white text-base">Reliable Foundation</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                            Crafted with React 19, Spring Boot, and Redis microservices to ensure resilient uptime and sub-second execution.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-slate-800">
                    <div className="lg:col-span-5 space-y-5">
                        <div className="space-y-1.5">
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                                Have questions or suggestions?
                            </h2>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                                We are constantly expanding the tool catalog. Let us know if you need a specific converter, API limit adjustments, or have feedback.
                            </p>
                        </div>

                        <div className="space-y-3 text-xs sm:text-sm pt-2">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
                                    <Mail size={16} />
                                </div>
                                <span>support@devtoolbox.io</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
                                    <Globe size={16} />
                                </div>
                                <span>All Systems Operational</span>
                            </div>

                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
                                    <MapPin size={16} />
                                </div>
                                <span>Kolkata, India</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <label className="text-xs font-medium text-slate-300">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Alex"
                                        className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                                        value={enquiry.name}
                                        onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1 text-left">
                                    <label className="text-xs font-medium text-slate-300">Email</label>
                                    <input
                                        type="email"
                                        placeholder="alex@company.com"
                                        className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                                        value={enquiry.email}
                                        onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-xs font-medium text-slate-300">Topic</label>
                                <select
                                    className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
                                    value={enquiry.inquiryTopic}
                                    onChange={(e) => setEnquiry({ ...enquiry, inquiryTopic: e.target.value })}
                                >
                                    <option value="General Feedback">General Feedback</option>
                                    <option value="Tool Request">Tool Request</option>
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="API Inquiry">API Inquiry</option>
                                </select>
                            </div>

                            <div className="space-y-1 text-left">
                                <label className="text-xs font-medium text-slate-300">Message</label>
                                <textarea
                                    rows={4}
                                    placeholder="Write your message here..."
                                    className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
                                    value={enquiry.message}
                                    onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                                <Send size={15} />
                                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </PageBackground>
    );
}
