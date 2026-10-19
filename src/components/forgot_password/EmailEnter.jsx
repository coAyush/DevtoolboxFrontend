import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import LoadingSpinner from "../../util/LoadingSpinner";

const EmailEnter = ({ step, setStep, onEmailSubmit, email: parentEmail, setEmail: setParentEmail }) => {
    const [localEmail, setLocalEmail] = useState("");
    const email = parentEmail !== undefined ? parentEmail : localEmail;
    const setEmail = setParentEmail || setLocalEmail;
    const [remaining, setRemaining] = useState(30);
    const [isLoading, setIsLoading] = useState(false);

    const sendData = () => {
        if (!email.trim()) {
            alert("Please enter your email address");
            return;
        }
        setIsLoading(true);

        setTimeout(() => {
            console.log("Password reset code sent to:", email);
            setIsLoading(false);
            if (onEmailSubmit) {
                onEmailSubmit(email);
            }
            setStep(2);
            setRemaining(30);
        }, 1500);
    };

    useEffect(() => {
        if (step !== 2 || remaining <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [step, remaining]);

    return (
        <div className="relative w-[90%] sm:w-[75%] md:w-[60%] lg:w-[45%] 
                        min-h-[260px] p-[1px] rounded-2xl overflow-hidden">

            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899,#06b6d4)]
                            bg-[length:300%_100%] animate-border-flow" />

            {/* Card */}
            <div className="relative h-full w-full rounded-2xl
                            bg-slate-950/90 backdrop-blur-xl
                            px-6 py-6
                            flex flex-col justify-center gap-5">

                {/* Step indicator */}
                <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                        STEP 1 OF 4
                    </span>

                    <span className="text-xs text-slate-500">
                        Account Recovery
                    </span>

                </div>

                {/* Heading */}
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        Reset your password
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Enter the email associated with your DevToolBox account.
                    </p>
                </div>

                {/* Email input */}
                <div className="flex flex-col gap-2">

                    <label className="text-sm font-medium text-slate-300">
                        Email address
                    </label>

                    <input
                        className="w-full h-12
                                   bg-slate-900/70
                                   border border-slate-700
                                   focus:border-cyan-400
                                   focus:ring-2 focus:ring-cyan-400/20
                                   transition-all duration-200
                                   px-4 rounded-xl
                                   text-white
                                   outline-none
                                   placeholder:text-slate-500"
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                </div>

                {/* Button */}
                <button
                    className="relative w-full h-12
                               rounded-xl
                               bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500
                               hover:brightness-110
                               active:scale-[0.99]
                               transition-all duration-200
                               flex items-center justify-center
                               disabled:opacity-60
                               disabled:cursor-not-allowed"
                    onClick={sendData}
                    disabled={
                        isLoading ||
                        (step === 2 && remaining > 0)
                    }
                >

                    {isLoading ? (
                        <LoadingSpinner
                            color="white"
                            loading={true}
                            size={25}
                        />
                    ) : (
                        <span className="font-semibold text-white">
                            {step === 2 ? "Resend Verification Code" : "Send Verification Code"}
                        </span>
                    )}

                </button>

                {/* Timer */}
                {step === 2 && remaining > 0 && (
                    <div className="absolute bottom-1 right-5
                                    px-3 py-1
                                    rounded-full
                                    bg-red-500/10
                                    border border-red-500/20
                                    text-xs font-medium
                                    text-red-300">
                        Resend in {remaining}s
                    </div>
                )}

                {/* Back to login link */}
                <div className="text-center text-xs text-slate-400 mt-1">
                    Remember your password?{" "}
                    <NavLink to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline">
                        Back to Login
                    </NavLink>
                </div>

            </div>
        </div>
    );
};

export default EmailEnter;