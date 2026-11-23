import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    ShieldAlert,
    Calendar,
    Zap,
    Sparkles,
    BarChart3,
    ArrowUpRight,
    RefreshCw,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Lock,
    ExternalLink
} from 'lucide-react';
import { Link, useLoaderData } from 'react-router';
import { getUserProfileApi } from '../../services/user/UserProfileService';
import { useUserDetails } from '../../context/User/UserDetailsContext';
import { toastCustom } from '../../util/toat';

/**
 * User Profile & Account Details Page
 * Fetches dynamic profile, subscription, and monthly tool usage metrics from:
 * GET /api/users/profile-details
 */
const UserProfile = () => {
    const loaderData = useLoaderData();
    const { user } = useUserDetails();

    // Check loader data, context fallback, or null
    const initialProfile = (() => {
        if (loaderData?.data?.details) return loaderData.data.details;
        if (loaderData?.data && typeof loaderData.data === 'object' && !Array.isArray(loaderData.data)) return loaderData.data;
        if (loaderData && typeof loaderData === 'object' && loaderData.name) return loaderData;
        if (user?.userDetails) return user.userDetails;
        return null;
    })();

    const [profile, setProfile] = useState(initialProfile);
    const [loading, setLoading] = useState(!initialProfile);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Fetch profile data on mount / refresh
    const fetchProfile = async (isManualRefresh = false) => {
        try {
            if (isManualRefresh) setRefreshing(true);
            else if (!profile) setLoading(true);
            setError(null);

            const res = await getUserProfileApi();
            console.log("Profile API response:", res);

            const profileData = res?.data?.details ?? res?.data ?? (res?.name ? res : null);
            if (profileData) {
                setProfile(prev => ({ ...(prev || {}), ...profileData }));
                if (isManualRefresh) toastCustom("Profile details refreshed!");
            } else if (user?.userDetails) {
                setProfile(prev => ({ ...(prev || {}), ...user.userDetails }));
            } else {
                throw new Error("Invalid response format");
            }
        } catch (err) {
            console.error("Failed to load user profile:", err);
            if (!profile && !user?.userDetails) {
                setError("Failed to fetch profile details. Please try again.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // Format ISO dates safely
    const formatDate = (dateVal) => {
        if (!dateVal) return "N/A";
        try {
            const date = new Date(dateVal);
            if (isNaN(date.getTime())) return String(dateVal);
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return String(dateVal);
        }
    };

    // Calculate usage percentage
    const monthlyUsage = profile?.monthlyUsage ?? 0;
    const usageLimit = profile?.usageLimit ?? 200;
    const remainingUsage = profile?.remainingUsage ?? Math.max(0, usageLimit - monthlyUsage);
    const usagePercentage = usageLimit > 0 ? Math.min(100, Math.round((monthlyUsage / usageLimit) * 100)) : 0;

    // Check if user has uploaded image or single initial
    const hasImage = profile?.profileImageUrl && profile.profileImageUrl.length > 2 && profile.profileImageUrl.startsWith('http');
    const userInitial = profile?.profileImageUrl && profile.profileImageUrl.length <= 2 
        ? profile.profileImageUrl 
        : (profile?.name ? profile.name.charAt(0).toUpperCase() : 'U');

    const isPro = (profile?.subscriptionTier || '').toUpperCase() === 'PRO';
    const isActiveSubscription = profile?.subscriptionStatus !== false;

    return (
        <div className="w-full max-w-6xl mx-auto py-6 sm:py-10 px-2 sm:px-4 text-slate-100">
            {/* Header & Refresh */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        <User size={13} /> Account Center
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        User <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Profile</span>
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">
                        Manage your account settings, subscription tier, and monthly API quotas.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchProfile(true)}
                    disabled={refreshing || loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-all shadow-md shadow-black/30"
                >
                    <RefreshCw size={15} className={refreshing ? "animate-spin text-cyan-400" : ""} />
                    <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
                </button>
            </div>

            {/* Loading / Error States */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="animate-spin text-cyan-400" size={38} />
                    <p className="text-sm text-slate-400">Loading your profile details...</p>
                </div>
            ) : error ? (
                <div className="max-w-md mx-auto p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center flex flex-col items-center gap-3">
                    <AlertCircle size={28} />
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => fetchProfile()}
                        className="px-4 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-xs font-semibold text-white transition-all"
                    >
                        Try Again
                    </button>
                </div>
            ) : profile && (
                <div className="space-y-6 sm:space-y-8">
                    {/* Primary Hero Identity Card */}
                    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 shadow-xl shadow-cyan-500/5">
                        <div className="rounded-2xl bg-[#0B1220]/95 backdrop-blur-xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                            {/* Avatar and Identity */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl p-1 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
                                        {hasImage ? (
                                            <img
                                                src={profile.profileImageUrl}
                                                alt={profile.name || "User"}
                                                className="h-full w-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <div className="h-full w-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-cyan-400 to-purple-400">
                                                {userInitial}
                                            </div>
                                        )}
                                    </div>
                                    {/* Online indicator */}
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#0B1220] flex items-center justify-center shadow-md" title="Active">
                                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                    </div>
                                </div>

                                {/* User Details */}
                                <div>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                            {profile.name || "Developer"}
                                        </h2>
                                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                                            {profile.role || "USER"}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-400 mb-3">
                                        <span className="flex items-center gap-1.5">
                                            <Mail size={14} className="text-slate-500" />
                                            {profile.email}
                                        </span>
                                        {profile.phoneNumber && (
                                            <>
                                                <span className="text-slate-600">•</span>
                                                <span className="flex items-center gap-1.5">
                                                    <Phone size={14} className="text-slate-500" />
                                                    {profile.phoneNumber}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Badges Row */}
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {/* Verification */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                            profile.emailVerified 
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                        }`}>
                                            {profile.emailVerified ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                                            {profile.emailVerified ? "Email Verified" : "Pending Verification"}
                                        </span>

                                        {/* Login Provider */}
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                            <Lock size={12} className="text-slate-400" />
                                            {profile.loginProvider || "Local Auth"}
                                        </span>

                                        {/* Joined */}
                                        {profile.createdAt && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-900 border border-slate-800">
                                                <Calendar size={12} className="text-slate-500" />
                                                Joined {formatDate(profile.createdAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Upgrade Callout */}
                            <div className="shrink-0 w-full md:w-auto flex flex-col items-center md:items-end gap-2 text-center md:text-right border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                                    Subscription Tier
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xl sm:text-2xl font-black uppercase tracking-tight ${isPro ? 'text-cyan-400' : 'text-slate-200'}`}>
                                        {profile.subscriptionTier || 'FREE'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                        isActiveSubscription 
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                    }`}>
                                        {isActiveSubscription ? 'Active' : 'Expired'}
                                    </span>
                                </div>
                                <Link
                                    to="/user/pricing"
                                    className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/40"
                                >
                                    <Sparkles size={13} />
                                    <span>{isPro ? "Manage Plan" : "Upgrade to Pro"}</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Middle Grid: Usage Metrics & Subscription Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 1. Monthly Tool Usage & Quota Card */}
                        <div className="rounded-2xl bg-[#0B1220] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-black/40">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                            <BarChart3 size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-bold text-white">Monthly Tool Quota</h3>
                                            <p className="text-xs text-slate-400">Real-time usage across all developer tools</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                                        {usagePercentage}% Used
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="my-5">
                                    <div className="flex justify-between items-center text-xs font-medium text-slate-400 mb-2">
                                        <span>Progress: {monthlyUsage} of {usageLimit} operations</span>
                                        <span className="text-emerald-400 font-semibold">{remainingUsage} remaining</span>
                                    </div>
                                    <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${usagePercentage}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                            className={`h-full rounded-full ${
                                                usagePercentage > 90 
                                                    ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                                                    : 'bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500'
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* 3 Metric Stats */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                        <span className="block text-xs text-slate-400 mb-1">Operations Used</span>
                                        <span className="text-lg sm:text-xl font-extrabold text-cyan-400">{monthlyUsage}</span>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                        <span className="block text-xs text-slate-400 mb-1">Remaining</span>
                                        <span className="text-lg sm:text-xl font-extrabold text-emerald-400">{remainingUsage}</span>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                                        <span className="block text-xs text-slate-400 mb-1">Monthly Limit</span>
                                        <span className="text-lg sm:text-xl font-extrabold text-purple-400">{usageLimit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Low quota warning */}
                            {remainingUsage <= 20 && (
                                <div className="mt-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                                    <AlertCircle size={18} className="shrink-0 text-amber-400" />
                                    <span>
                                        You are running low on monthly tool operations. Upgrade to Pro for 500 requests/month!
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* 2. Subscription Details Card */}
                        <div className="rounded-2xl bg-[#0B1220] border border-slate-800 p-6 sm:p-7 flex flex-col justify-between shadow-lg shadow-black/40">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-bold text-white">Subscription Status</h3>
                                        <p className="text-xs text-slate-400">Current tier features and billing period</p>
                                    </div>
                                </div>

                                <div className="space-y-3.5 my-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm">
                                        <span className="text-slate-400">Active Tier:</span>
                                        <span className="font-bold text-white uppercase">{profile.subscriptionTier || 'FREE'}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm">
                                        <span className="text-slate-400">Billing Cycle:</span>
                                        <span className="font-medium text-slate-200">Monthly</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm">
                                        <span className="text-slate-400">Start Date:</span>
                                        <span className="text-slate-300 font-mono text-xs">
                                            {formatDate(profile.subscriptionStartDate || profile.createdAt)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs sm:text-sm">
                                        <span className="text-slate-400">Renews / Expiry:</span>
                                        <span className="text-slate-300 font-mono text-xs">
                                            {profile.subscriptionEndDate ? formatDate(profile.subscriptionEndDate) : 'Rolling Free Tier'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/user/pricing"
                                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Explore All Subscription Plans</span>
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: Quick Launch Shortcuts */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-base font-bold text-white">Ready to build?</h4>
                            <p className="text-xs text-slate-400">
                                Launch your productivity tools suite or view historical API requests on the dashboard.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Link
                                to="/user/tools"
                                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all text-center shadow-md shadow-cyan-500/20"
                            >
                                Open Tool Suite
                            </Link>
                            <Link
                                to="/user/dashboard"
                                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all text-center"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
