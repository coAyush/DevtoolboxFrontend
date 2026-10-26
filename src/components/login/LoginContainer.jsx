import { useState } from "react";
import { Folders, WandSparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Navigate, NavLink, useNavigate } from "react-router";
import { CgPassword } from "react-icons/cg";
import { toastError, toastLoading, toastSuccess } from "../../util/toat";
import { loginService } from "../../services/landing/Login";

const LoginContainer = ({ desc, setStep, onRequireOtp, setEmail }) => {
    const navigate = useNavigate();
    const [loginForm, setLoginForm] = useState({
        role: "",
        email: "",
        password: "",
        remember: false
    })
    const [isDeveloper, setIsDeveloper] = useState(false);
    const handleOauthLogin = async (provider, role) => {
        try {
            if (!role) {
                toastError("Please select a workspace type first");
                return;
            }
            toastLoading("Redirecting to login")
            const params = new URLSearchParams({
                provider,
                role: role === "Normal User" ? "USER" : "DEVELOPER"
            });
            window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/login?${params}`;
        } catch (error) {
            console.log(error);
            toastError(error)
        }

    }
    const sendLoginData = async () => {
        console.log("Button Clicked and form data is", { loginForm });
        if (loginForm.password.length <= 8 || loginForm.email.length <= 0) {
            alert("Password must be at least 8 characters long and email is required");
            return;
        }
        if (loginForm.email.length <= 0) {
            alert("Email is required");
            return;
        }
        try {
            toastLoading("submitting login data");
            const { code, message, status, data } = await loginService({ loginForm });
            console.log("Intry block");
            if (code === 0) {
                toastSuccess(status + `\n` + message);
                setEmail(loginForm.email);
            } else {
                toastError(status + `\n` + message)
            }
            setStep(2);

        } catch (error) {
            console.log("catch block");
            console.log(error);

        }
    }
    return (
        <div className="relative w-full max-w-[560px] p-[2px] rounded-[28px] bg-gradient-to-br from-cyan-400/90 via-cyan-400/20 to-purple-500/80 shadow-[0_0_50px_-10px_rgba(34,211,238,0.3),0_0_30px_-10px_rgba(168,85,247,0.2)] z-20 transition-all duration-300">
            {/*
             * RESPONSIVE MODAL/CARD TIP:
             * On mobile, don't use heavy horizontal padding like `p-7 sm:p-9`.
             * Instead, scale padding: `p-4 sm:p-7 md:p-9`.
             * Also stack multi-column options with `flex-col sm:flex-row`
             * so text isn't squeezed into unreadable columns on phones.
             */}
            <div className="w-full bg-[#0b101b]/95 backdrop-blur-2xl rounded-[22px] sm:rounded-[26px] p-4 sm:p-7 md:p-9 flex flex-col items-center gap-4">
                <h2 aria-label="heading" className="font-extrabold text-2xl sm:text-3xl text-white text-center tracking-tight">
                    Welcome to DevToolBox
                </h2>
                <p aria-label="description" className="text-slate-400 text-xs sm:text-sm md:text-[15px] font-normal text-center -mt-1 tracking-normal max-w-sm sm:max-w-md">
                    {desc || "Select your workspace type to personalize your experience"}
                </p>
                <div className="flex flex-col sm:flex-row justify-between w-full mt-1.5 gap-3 sm:gap-4">
                    <div
                        onClick={() => { setLoginForm({ ...loginForm, role: "Normal User" }); setIsDeveloper(false) }}
                        className={`rounded-2xl flex flex-col justify-between w-full sm:w-1/2 p-3.5 sm:p-5 transition-all duration-200 cursor-pointer ${loginForm.role === "Normal User"
                            ? "border-2 border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
                            : "border border-slate-700/60 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/40 hover:-translate-y-0.5"
                            }`}
                    >
                        <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3.5">
                            <WandSparkles size={24} className="text-cyan-400" />
                            <Folders size={24} className="text-cyan-400" />
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm sm:text-base md:text-[17px]">Normal User</div>
                            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-400 font-normal mt-1">
                                Instant browser productivity tools for creators and teams
                            </div>
                        </div>
                    </div>

                    {/* Developer Card */}
                    <div
                        onClick={() => { setLoginForm({ ...loginForm, role: "Developer" }); setIsDeveloper(true) }}
                        className={`rounded-2xl flex flex-col justify-between w-full sm:w-1/2 p-3.5 sm:p-5 transition-all duration-200 cursor-pointer ${isDeveloper
                            ? "border-2 border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
                            : "border border-slate-700/60 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/40 hover:-translate-y-0.5"
                            }`}
                    >
                        <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-600/70 bg-slate-800/40 flex items-center justify-center text-slate-300 font-mono text-xs sm:text-sm font-bold">
                                {"{ }"}
                            </div>
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-600/70 bg-slate-800/40 flex items-center justify-center text-slate-300 font-mono text-xs sm:text-sm font-bold">
                                {"$_"}
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm sm:text-base md:text-[17px]">Developer</div>
                            <div className="text-xs sm:text-[13px] leading-relaxed text-slate-400 font-normal mt-1">
                                REST APIs, API Keys, webhooks, and SDKs for builders
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Login Buttons */}
                <div className="flex flex-col gap-2.5 w-full mt-1.5">
                    <button
                        type="button"
                        className="w-full h-11 sm:h-12 bg-slate-900/60 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-500 rounded-full flex items-center justify-center gap-2.5 text-sm sm:text-[14.5px] font-medium text-slate-200 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        onClick={() => handleOauthLogin("GOOGLE", loginForm.role)}
                    >
                        <FcGoogle size={22} />
                        <span>Continue with Google</span>
                    </button>
                    <button
                        type="button"
                        className={` ${isDeveloper ? "block" : "hidden"} w-full h-11 sm:h-12 bg-slate-900/60 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-500 rounded-full flex items-center justify-center gap-2.5 text-sm sm:text-[14.5px] font-medium text-slate-200 hover:text-white transition-all duration-200 cursor-pointer relative px-4 sm:px-6 shadow-sm hover:shadow-md`}
                        onClick={() => handleOauthLogin("GITHUB", loginForm.role)}
                    >
                        <div className="flex items-center justify-center gap-2.5">
                            <FaGithub size={22} className="text-white" />
                            <span>Continue with GitHub</span>
                        </div>
                        <span className="text-xs text-purple-300 bg-purple-950/80 border border-purple-500/40 px-2.5 py-0.5 rounded-full font-medium ml-2">
                            Developers only
                        </span>
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center w-full my-1">
                    <div className="flex-1 h-px bg-slate-800"></div>
                    <span className="px-3.5 text-xs sm:text-[13px] text-slate-400 font-medium tracking-wide">or login with email</span>
                    <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                {/* Form Inputs */}
                <div aria-label="form" className="w-full flex flex-col gap-3.5">
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs sm:text-[13px] font-medium text-slate-300">Email Address</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full text-left">
                        <div className="flex items-center justify-between">
                            <label className="text-xs sm:text-[13px] font-medium text-slate-300">Password</label>
                            <NavLink to="/password-reset" className="text-xs sm:text-[13px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                                Forgot password?
                            </NavLink>
                        </div>
                        <input
                            type="password"
                            placeholder="Minimum 8 characters"
                            className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-700/80 bg-slate-900/70 text-sm sm:text-base text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        />
                    </div>
                </div>

                {/* Submit Action Button */}
                <button
                    type="button"
                    className="w-full h-11 sm:h-12.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base tracking-wide shadow-lg shadow-purple-950/60 hover:shadow-purple-700/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer mt-1.5"
                    onClick={() => { sendLoginData() }}
                >
                    Login
                </button>

                {/* Signup Link */}
                <div className="text-center text-xs sm:text-sm text-slate-400 mt-1">
                    Don't have an account?{" "}
                    <NavLink to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline">
                        Sign up
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default LoginContainer;