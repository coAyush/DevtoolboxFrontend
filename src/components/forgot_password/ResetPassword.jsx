import { useState } from "react";
import LoadingSpinner from "../../util/LoadingSpinner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
const ResetPassword = ({ step, setStep, email, onBack }) => {
    const [password, setPassword] = useState("");
    const [retyped, setRetyped] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [cshow, setCshow] = useState(false);

    const passwordsMatch = password === retyped;
    const canSubmit =
        password.length > 0 &&
        retyped.length > 0 &&
        passwordsMatch;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (setStep) {
            setStep(2);
        }
    };

    const submitData = () => {
        if (!canSubmit) {
            return;
        }

        setIsLoading(true);

        console.log({
            email,
            password,
            retyped
        });

        setTimeout(() => {
            setIsLoading(false);
            console.log("Password reset successful");
        }, 3000);
    };

    return (
        <div
            aria-label="new-password"
            className="
            relative
            w-[90%]
            sm:w-[75%]
            md:w-[60%]
            lg:w-[45%]
            p-[1px]
            rounded-2xl
            overflow-hidden
        "
        >
            {/* Animated gradient border */}
            <div
                className="
                absolute inset-0
                bg-[linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899,#06b6d4)]
                bg-[length:300%_100%]
                animate-border-flow
            "
            />

            {/* Card */}
            <div
                className="
                relative
                w-full
                rounded-2xl
                bg-slate-950/90
                backdrop-blur-xl
                px-6 py-6
                flex flex-col
                gap-5
            "
            >
                {/* Header with Back button & Step indicator */}
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-1.5 px-2.5 py-1 -ml-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all cursor-pointer group"
                    >
                        <ArrowLeft size={16} className="text-cyan-400 transition-transform group-hover:-translate-x-1" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                            STEP 3 OF 3
                        </span>
                        <span className="text-xs text-slate-500">
                            Password Reset
                        </span>
                    </div>
                </div>

                {/* Heading */}
                <div>

                    <h2 className="text-2xl font-bold text-white">
                        Create a new password
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Choose a strong password for your DevToolBox account.
                    </p>

                </div>

                {/* New password */}
                <div className="flex flex-col gap-2">

                    <label
                        htmlFor="new-password"
                        className="text-sm font-medium text-slate-300"
                    >
                        New password
                    </label>
                    <div className="relative">
                        <input
                            id="new-password"
                            className="
                                w-full h-12
                                bg-slate-900/70
                                border border-slate-700
                                focus:border-cyan-400
                                focus:ring-2
                                focus:ring-cyan-400/20
                                transition-all duration-200
                                px-4
                                rounded-xl
                                text-white
                                outline-none
                                placeholder:text-slate-500
                            "
                            placeholder="Enter your new password"
                            type={show ? "text" : "password"}
                            maxLength={25}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShow(prev => !prev)}
                            className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-slate-400
        hover:text-cyan-400
        transition-colors
        cursor-pointer
    "
                        >
                            {show
                                ? <EyeOff size={20} />
                                : <Eye size={20} />
                            }
                        </button>                        </div>
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-2">

                    <label
                        htmlFor="confirm-password"
                        className="text-sm font-medium text-slate-300"
                    >
                        Confirm password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            className={`
                                w-full h-12
                                bg-slate-900/70
                                border
                                ${retyped && !passwordsMatch
                                    ? "border-red-500 focus:border-red-400"
                                    : "border-slate-700 focus:border-cyan-400"
                                }
                                focus:ring-2
                                focus:ring-cyan-400/20
                                transition-all duration-200
                                px-4
                                rounded-xl
                                text-white
                                outline-none
                                placeholder:text-slate-500
                            `}
                            placeholder="Re-enter your password"
                            type={cshow ? "password" : "text"}
                            value={retyped}
                            onChange={(event) =>
                                setRetyped(event.target.value)
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setCshow(prev => !prev)}
                            className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-slate-400
        hover:text-cyan-400
        transition-colors
        cursor-pointer
    "
                        >{cshow ? <Eye size={20} /> : <EyeOff size={20} />}                                </button>
                    </div>
                    {retyped && !passwordsMatch && (
                        <p className="text-xs text-red-400">
                            Passwords do not match.
                        </p>
                    )}

                </div>

                {/* Submit */}
                <button
                    className="
                            relative
                            w-full h-12
                            rounded-xl
                            bg-gradient-to-r
                            from-cyan-500
                            via-purple-500
                            to-pink-500
                            hover:brightness-110
                            active:scale-[0.99]
                            transition-all duration-200
                            flex items-center justify-center
                            disabled:opacity-60
                            disabled:cursor-not-allowed
                        "
                    onClick={submitData}
                    disabled={isLoading || !canSubmit}
                >

                    {isLoading ? (
                        <LoadingSpinner
                            color="white"
                            loading={true}
                            size={25}
                        />
                    ) : (
                        <span className="font-semibold text-white">
                            Reset Password
                        </span>
                    )}

                </button>

            </div>

        </div>
    );
};

export default ResetPassword;