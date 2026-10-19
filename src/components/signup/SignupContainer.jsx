import { useEffect, useState } from "react";
import { Folders, WandSparkles } from "lucide-react";
import { NavLink } from "react-router";
import { SignupUser } from "../../services/landing/Signup";
import { toastCustom, toastError, toastLoading, toastSuccess } from "../../util/toat";

const SignupContainer = ({ desc, setStep, setSignupStep, onSuccess, form: parentForm, setForm: setParentForm }) => {
    const [isDeveloper, setIsDeveloper] = useState(false);
    const [localForm, setLocalForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
        isVerified: false,
        accountType: "LOCAL",
    });

    const form = parentForm || localForm;
    const setForm = setParentForm || setLocalForm;

    const sendSignupData = async () => {
        if (!form.email.trim()) {
            alert("Email is required");
            return;
        }

        if (!form.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!form.phone.trim()) {
            alert("Phone number is required");
            return;
        }

        if (!form.password || form.password.length < 8) {
            alert("Password must be at least 8 characters long");
            return;
        }

        if (!form.role) {
            alert("Role is required");
            return;
        }
        try {
            toastLoading("submitting form data...")
            const { code, message, status, data } = await SignupUser({ form });

            if (code == 0) {
                toastSuccess(status + `\n` + message);
                if (onSuccess) {
                    onSuccess(form.email);
                }
                if (setStep) {
                    setStep(2);
                }
                if (setSignupStep) {
                    setSignupStep(2);
                }
            } else {
                toastError(status + '\n' + message);
            }
        } catch (error) {
            console.log("catch block");
            console.log(error);
        }
    };
    return (
        <div className="relative w-full max-w-[560px] p-[2px] rounded-[28px] bg-gradient-to-br from-cyan-400/90 via-cyan-400/20 to-purple-500/80 shadow-[0_0_50px_-10px_rgba(34,211,238,0.3),0_0_30px_-10px_rgba(168,85,247,0.2)] z-20 transition-all duration-300">
            <div className="w-full bg-[#0b101b]/95 backdrop-blur-2xl rounded-[26px] p-7 sm:p-9 flex flex-col items-center gap-4">
                <h2 aria-label="heading" className="font-extrabold text-2xl sm:text-3xl text-white text-center tracking-tight">
                    Welcome to DevToolBox
                </h2>
                <p aria-label="description" className="text-slate-400 text-sm sm:text-[15px] font-normal text-center -mt-1 tracking-normal max-w-sm sm:max-w-md">
                    {desc || "Select your workspace type to personalize your experience"}
                </p>
                <div className="flex justify-between w-full mt-1.5 gap-3.5 sm:gap-4">
                    <div
                        onClick={() => { setForm({ ...form, role: "USER" }); setIsDeveloper(false) }}
                        className={`rounded-2xl flex flex-col justify-between w-1/2 p-4 sm:p-5 transition-all duration-200 cursor-pointer ${form.role === "USER"
                            ? "border-2 border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
                            : "border border-slate-700/60 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/40 hover:-translate-y-0.5"
                            }`}
                    >
                        <div className="flex items-center justify-between w-full mb-3.5">
                            <WandSparkles size={28} className="text-cyan-400" />
                            <Folders size={28} className="text-cyan-400" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-base sm:text-[17px]">Normal User</div>
                            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-400 font-normal mt-1.5">
                                Instant browser productivity tools for creators and teams
                            </div>
                        </div>
                    </div>

                    {/* Developer Card */}
                    <div
                        onClick={() => { setForm({ ...form, role: "DEVELOPER" }); setIsDeveloper(true) }}
                        className={`rounded-2xl flex flex-col justify-between w-1/2 p-4 sm:p-5 transition-all duration-200 cursor-pointer ${isDeveloper
                            ? "border-2 border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
                            : "border border-slate-700/60 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/40 hover:-translate-y-0.5"
                            }`}
                    >
                        <div className="flex items-center justify-between w-full mb-3.5">
                            <div className="w-8 h-8 rounded-lg border border-slate-600/70 bg-slate-800/40 flex items-center justify-center text-slate-300 font-mono text-sm font-bold">
                                {"{ }"}
                            </div>
                            <div className="w-8 h-8 rounded-lg border border-slate-600/70 bg-slate-800/40 flex items-center justify-center text-slate-300 font-mono text-sm font-bold">
                                {"$_"}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-white text-base sm:text-[17px]">Developer</div>
                            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-400 font-normal mt-1.5">
                                REST APIs, API Keys, webhooks, and SDKs for builders
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Inputs */}

                <div aria-label="form" className="w-full flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs sm:text-[13px] font-medium text-slate-300">Full Name</label>
                        <input
                            type="text"
                            placeholder="john doe"
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs sm:text-[13px] font-medium text-slate-300">Phone Number</label>
                        <input
                            type="number"
                            placeholder="10 digit phone number"
                            maxLength={10}
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs sm:text-[13px] font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs sm:text-[13px] font-medium text-slate-300">Password</label>
                        <input
                            type="password"
                            placeholder="Minimum 20 characters"
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={form.password}
                            maxLength={20}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>
                </div>

                {/* Submit Action Button */}
                <button
                    type="button"
                    className="w-full h-11 sm:h-12.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base tracking-wide shadow-lg shadow-purple-950/60 hover:shadow-purple-700/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer mt-1.5"
                    onClick={() => sendSignupData()}
                >
                    Signup
                </button>

                {/* Login Link */}
                <div className="text-center text-xs sm:text-sm text-slate-400 mt-1">
                    Already have an account?{" "}
                    <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline">
                        Login
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default SignupContainer;