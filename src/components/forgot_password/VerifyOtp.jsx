import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import LoadingSpinner from "../../util/LoadingSpinner";
import { toastError, toastSuccess } from "../../util/toat";
import { ArrowLeft } from "lucide-react";
import { verifyOtp } from "../../services/landing/VerifyOtp";

const VerifyOtp = ({ setStep, email, onSuccess, seSignUpStep }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();

    const resolvedEmail = email || location.state?.email || "";

    const handleChange = (event, index) => {
        const value = event.target.value;

        if (!/^\d?$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;

        setOtp(newOtp);

        if (value && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRef.current[index - 1]?.focus();
            }
        } else if (event.key === "ArrowLeft" && index > 0) {
            inputRef.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < 5) {
            inputRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event) => {
        event.preventDefault();
        const pastedData = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pastedData) return;

        const newOtp = [...otp];
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i];
        }
        setOtp(newOtp);

        const nextIndex = Math.min(pastedData.length, 5);
        inputRef.current[nextIndex]?.focus();
    };

    const sendData = async () => {
        setIsLoading(true);
        const otpValue = otp.join("");
        if (otpValue.length !== 6) return;
        const otpSubmit = {
            otp: otpValue,
            email: resolvedEmail
        }
        try {
            console.log("Verifying OTP:", otpValue, "for:", resolvedEmail);
            const { code, message, status, data } = await verifyOtp(otpSubmit);
            setIsLoading(false)

            if (code == 0) {
                toastSuccess(status + `\n` + message)
                console.log(data);
                const role = data.role.toLowerCase();
                navigate(`/${role}`)
            } else {
                toastError(status + `\n` + message)
            }
            // console.log(data);
            // If an onSuccess callback was passed from parent (e.g., SignupContainer)
            /* if (onSuccess) {
                 await onSuccess({ otp: otpValue, email: resolvedEmail });
             } else if (setStep) {
                 // If in ForgotPassword flow, proceed to step 3 (ResetPassword)
                 setStep(3);
             } else {
                 // Default fallback: notify and navigate to login
                 toastSuccess("Email verified successfully!");
                 navigate("/login");
             }*/
        } catch (error) {
            console.error("OTP verification error:", error);
            toastError(error?.message || "Failed to verify OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-[90%] sm:w-[75%] md:w-[60%] lg:w-[45%]
                        p-[1px] rounded-2xl overflow-hidden z-10">
            <div className="flex items-center justify-center gap-1">
                <button className="text-white absolute top-6 left-6 z-20 cursor-pointer hover:text-blue-400 transition-colors duration-200" onClick={() => sp(1)}><ArrowLeft size={30} color="green" />
                </button>
            </div>
            {/* Gradient border */}
            <div className="absolute inset-0
                            bg-[linear-gradient(90deg,#06b6d4,#8b5cf6,#ec4899,#06b6d4)]
                            bg-[length:300%_100%]
                            animate-border-flow" />

            <div className="relative rounded-2xl
                            bg-slate-950/90
                            backdrop-blur-xl
                            px-6 py-6
                            flex flex-col gap-6">

                {/* Header */}
                <div className="flex items-center justify-between">

                    <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                        STEP 2 OF 3
                    </span>

                    <span className="text-xs text-slate-500">
                        Verification
                    </span>

                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white">
                        Verify your email
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Enter the 6-digit verification code sent to{" "}
                        {resolvedEmail ? (
                            <span className="text-cyan-400 font-medium">{resolvedEmail}</span>
                        ) : (
                            "your email"
                        )}.
                    </p>
                </div>

                {/* OTP boxes */}
                <div className="flex justify-center gap-2 sm:gap-3">

                    {otp.map((value, index) => (
                        <input
                            key={index}
                            value={value}
                            ref={(element) => {
                                inputRef.current[index] = element;
                            }}
                            onChange={(event) =>
                                handleChange(event, index)
                            }
                            onKeyDown={(event) =>
                                handleKeyDown(event, index)
                            }
                            onPaste={handlePaste}
                            inputMode="numeric"
                            type="text"
                            maxLength={1}
                            className="
                                w-10 h-12
                                sm:w-12 sm:h-14
                                text-center
                                text-lg sm:text-xl
                                font-bold
                                text-white
                                bg-slate-900/70
                                border border-slate-700
                                rounded-xl
                                outline-none

                                focus:border-cyan-400
                                focus:ring-2
                                focus:ring-cyan-400/20

                                transition-all duration-200
                            "
                        />
                    ))}

                </div>

                {/* Verify button */}
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
                    onClick={sendData}
                    disabled={isLoading || otp.join("").length !== 6}
                >

                    {isLoading ? (
                        <LoadingSpinner
                            color="white"
                            loading={true}
                            size={25}
                        />
                    ) : (
                        <span className="font-semibold text-white">
                            Verify Code
                        </span>
                    )}

                </button>

            </div>
        </div>
    );
};

export default VerifyOtp;