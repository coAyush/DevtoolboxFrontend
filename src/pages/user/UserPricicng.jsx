import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Check, 
    Sparkles, 
    ShieldCheck, 
    Zap, 
    Clock, 
    HelpCircle, 
    Loader2, 
    AlertCircle, 
    Layers, 
    ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router';
import { getUserPlansApi, getUserProfileApi } from '../../services/user/UserProfileService';
import { toastCustom } from '../../util/toat';

/**
 * User Pricing & Subscription Plans Page
 * Fetches dynamic plans from GET /api/users/plans
 * Highlights the user's active tier (FREE, PRO, etc.)
 */
const UserPricicng = () => {
    const [plans, setPlans] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    // Fetch plans and user profile data simultaneously
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch plans and profile in parallel
                const [plansRes, profileRes] = await Promise.allSettled([
                    getUserPlansApi(),
                    getUserProfileApi()
                ]);

                if (isMounted) {
                    if (plansRes.status === 'fulfilled' && plansRes.value?.data) {
                        const rawPlans = plansRes.value.data.details || plansRes.value.data || [];
                        setPlans(Array.isArray(rawPlans) ? rawPlans : []);
                    } else {
                        // Fallback default plans if endpoint hasn't seeded DB yet
                        setPlans([
                            { id: 1, amount: 0, role: "USER", tier: "FREE", duration: 30, isActive: true },
                            { id: 2, amount: 199, role: "USER", tier: "PRO", duration: 30, isActive: true }
                        ]);
                    }

                    if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
                        setUserProfile(profileRes.value.data.details || profileRes.value.data || null);
                    }
                }
            } catch (err) {
                console.error("Error loading pricing data:", err);
                if (isMounted) setError("Failed to load plans. Please try again.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();
        return () => { isMounted = false; };
    }, []);

    // Get active subscription tier of the user (e.g., 'FREE' or 'PRO')
    const currentTier = (userProfile?.subscriptionTier || 'FREE').toUpperCase();

    // Curated high-value feature list based on tier
    const getFeaturesForTier = (tier) => {
        const normalized = (tier || '').toUpperCase();
        if (normalized === 'FREE') {
            return [
                "200 Monthly Tool & API Operations",
                "Full Access to Core Productivity Suite",
                "Link Shortener with Real-Time Analytics",
                "QR Code Generator (Custom Sizes)",
                "Word Counter & UUID v4 Generator",
                "Standard File Compression Speed",
                "Community Discord Support"
            ];
        }
        if (normalized === 'PRO') {
            return [
                "500 Monthly Tool & API Operations",
                "Priority High-Speed Server Processing Queue",
                "Unlimited Custom URL Shortener Aliases",
                "High-Quality Multi-Page PDF Merge & Compress",
                "High-Ratio Image Compression (JPG/PNG)",
                "Detailed Monthly Usage Analytics",
                "Zero Queue Delays & Ad-Free Experience",
                "Direct 24/7 Priority Support"
            ];
        }
        // DEVELOPER / ULTIMATE
        return [
            "Unlimited Monthly Tool & API Operations",
            "Direct REST API Access with API Keys",
            "High Throughput & Custom Rate Limits",
            "Batch Operations & Background Webhooks",
            "Dedicated Support Engineer"
        ];
    };

    const handleSubscribeClick = (plan) => {
        if (plan.tier?.toUpperCase() === currentTier) {
            toastCustom(`You are already subscribed to the ${plan.tier} plan!`);
            return;
        }
        setSelectedPlanForModal(plan);
    };

    const handleConfirmUpgrade = () => {
        if (!selectedPlanForModal) return;
        toastCustom(`Subscribing to ${selectedPlanForModal.tier} plan... Redirecting to checkout.`);
        setSelectedPlanForModal(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 text-slate-100">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
                    <Sparkles size={14} /> DevToolBox Subscription
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                    Simple, Transparent <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Pricing</span>
                </h1>
                <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                    Choose the plan that fits your workflow. Supercharge your developer productivity with increased API quotas, faster processing, and priority support.
                </p>

                {/* Current Active Plan Pill */}
                {userProfile && (
                    <div className="mt-5 inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-lg shadow-black/40 text-xs sm:text-sm">
                        <span className="text-slate-400">Current Plan:</span>
                        <span className="px-2.5 py-0.5 rounded-md font-bold text-xs uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            {currentTier}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">Remaining Quota:</span>
                        <span className="font-semibold text-emerald-400">
                            {userProfile.remainingUsage ?? (userProfile.usageLimit - userProfile.monthlyUsage)} ops
                        </span>
                    </div>
                )}
            </div>

            {/* Loading / Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="animate-spin text-cyan-400" size={36} />
                    <p className="text-sm text-slate-400">Loading subscription plans...</p>
                </div>
            ) : error ? (
                <div className="max-w-md mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center flex flex-col items-center gap-2">
                    <AlertCircle size={24} />
                    <p className="text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-xs font-medium text-white transition-all"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                /* Pricing Cards Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch justify-center">
                    {plans.map((plan) => {
                        const tierUpper = (plan.tier || '').toUpperCase();
                        const isCurrent = tierUpper === currentTier;
                        const isPro = tierUpper === 'PRO';
                        const features = getFeaturesForTier(plan.tier);

                        return (
                            <motion.div
                                key={plan.id || plan.tier}
                                whileHover={{ y: -4 }}
                                transition={{ duration: 0.2 }}
                                className={`
                                    relative flex flex-col rounded-2xl p-[1px]
                                    transition-all duration-300
                                    ${isPro 
                                        ? 'bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_35px_rgba(139,92,246,0.25)]' 
                                        : 'bg-gradient-to-b from-slate-700/80 via-slate-800 to-slate-900 shadow-lg shadow-black/50'
                                    }
                                `}
                            >
                                {/* Pro / Featured Badge */}
                                {isPro && (
                                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-md">
                                        Most Popular
                                    </div>
                                )}

                                {/* Card Body */}
                                <div className="h-full w-full rounded-2xl bg-[#0B1220]/95 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between">
                                    <div>
                                        {/* Tier Name & Status */}
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <h3 className={`text-xl sm:text-2xl font-bold tracking-tight uppercase ${isPro ? 'text-cyan-400' : 'text-slate-200'}`}>
                                                {plan.tier}
                                            </h3>
                                            {isCurrent && (
                                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                                    <Check size={12} /> Active Plan
                                                </span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                                                    ₹{plan.amount}
                                                </span>
                                                <span className="text-xs sm:text-sm text-slate-400 font-medium">
                                                    / {plan.duration ? `${plan.duration} days` : 'month'}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-xs text-slate-400">
                                                {plan.amount === 0 
                                                    ? 'Free forever for individual developers.' 
                                                    : 'Billed periodically. Cancel anytime without penalty.'}
                                            </p>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-[1px] w-full bg-slate-800 mb-6" />

                                        {/* Features List */}
                                        <div className="space-y-3 mb-8">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                What's included:
                                            </p>
                                            <ul className="space-y-2.5">
                                                {features.map((feat, idx) => (
                                                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                                                        <div className={`mt-0.5 shrink-0 p-0.5 rounded-full ${isPro ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-cyan-400'}`}>
                                                            <Check size={13} />
                                                        </div>
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            disabled={isCurrent}
                                            onClick={() => handleSubscribeClick(plan)}
                                            className={`
                                                w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2
                                                ${isCurrent
                                                    ? 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                                                    : isPro
                                                        ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 hover:from-cyan-400 hover:to-pink-500 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40'
                                                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'
                                                }
                                            `}
                                        >
                                            {isCurrent ? (
                                                'Current Plan'
                                            ) : (
                                                <>
                                                    <span>{plan.amount === 0 ? 'Select Free' : `Upgrade to ${plan.tier}`}</span>
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Feature Comparison Section */}
            <div className="mt-16 sm:mt-24 p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
                <div className="text-center max-w-xl mx-auto mb-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h3>
                    <p className="mt-2 text-xs sm:text-sm text-slate-400">Everything you need to know about limits and billing.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
                        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm mb-2">
                            <Clock size={16} /> When does my quota reset?
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Tool usage quotas (200 for Free, 500 for Pro) automatically reset at the beginning of each billing month.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
                        <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm mb-2">
                            <Zap size={16} /> Can I upgrade anytime?
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Yes! Upgrading takes effect instantly, adding the remaining quota difference to your account immediately.
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/70">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                            <ShieldCheck size={16} /> Are my files private?
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            All processed documents and images are handled strictly in memory and wiped immediately after download.
                        </p>
                    </div>
                </div>
            </div>

            {/* Subscribe / Upgrade Modal */}
            <AnimatePresence>
                {selectedPlanForModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl bg-[#0B1220] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-500/10 text-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    <Sparkles size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Upgrade to {selectedPlanForModal.tier}</h3>
                                    <p className="text-xs text-slate-400">Review your subscription details</p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 my-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Plan Tier:</span>
                                    <span className="font-bold text-white uppercase">{selectedPlanForModal.tier}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Billing Duration:</span>
                                    <span className="text-white">{selectedPlanForModal.duration} Days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Amount:</span>
                                    <span className="font-extrabold text-cyan-400 text-base">₹{selectedPlanForModal.amount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Monthly Usage Limit:</span>
                                    <span className="text-emerald-400 font-semibold">
                                        {selectedPlanForModal.tier?.toUpperCase() === 'PRO' ? '500 Requests' : '200 Requests'}
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                By confirming, your account will be upgraded to the {selectedPlanForModal.tier} tier with increased tool limits and priority processing.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPlanForModal(null)}
                                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmUpgrade}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all"
                                >
                                    Confirm Upgrade
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserPricicng;
